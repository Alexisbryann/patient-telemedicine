<?php
//require("class-phpass.php");
require("PasswordHash.php");
require("connect.php");
session_start();

// variable declaration
$username = "";
$email    = "";
$errors   = array();
$inclusions_version = 64;

// call the register() function if register_btn is clicked
if (isset($_POST['register_btn'])) {
	register();
}

// call the login() function if login_btn is clicked
if (isset($_POST['login_btn'])) {
	login();
}

if (isset($_GET['logout'])) {
	$query_delete_session = mysqli_query($db, "UPDATE wp_users SET current_session = ''  WHERE user_login= '{$_SESSION['doctorid']['email']}'");
	$_SESSION = array();
	session_destroy();
	$days = 30;
	setcookie("rememberme", "", time() - ($days * 24 * 60 * 60 * 1000));
	setcookie("user_pass", "", time() - 3600);
	die(header("location: login"));
}

if (empty($_SESSION["doctorid"]) || empty($_SESSION["user"])) {
	$_SESSION = array();
	session_destroy();
	check_for_remember_me($db);
} else {
	$page_uri = explode("/", $_SERVER["REQUEST_URI"]);
	if (in_array(array_pop($page_uri), ["login", "login.php"]) && check_for_remember_me($db)) die(header("Location: dashboard"));
}

// REGISTER USER
function register()
{
	global $db, $errors, $hash;

	// receive all input values from the form
	$username = e($_POST['username']);
	$email = e($_POST['email']);
	$password_1 = e($_POST['password_1']);
	$password_2 = e($_POST['password_2']);

	// form validation: ensure that the form is correctly filled
	if (empty($username)) {
		array_push($errors, "Username is required");
	}
	if (empty($email)) {
		array_push($errors, "Email is required");
	}
	if (empty($password_1)) {
		array_push($errors, "Password is required");
	}
	if ($password_1 != $password_2) {
		array_push($errors, "The two passwords do not match");
	}

	// register user if there are no errors in the form
	if (count($errors) == 0) {

		$hasher = new PasswordHash(8, false);
		$hash = $hasher->HashPassword($password_1);
		//	$password = $wp_hasher->HashPassword($password_1);

		//	$password = md5($password_1);//encrypt the password before saving in the database

		if (isset($_POST['user_type'])) {
			$user_type = e($_POST['user_type']);
			$query = "INSERT INTO wp_users (user_login, role, user_pass, user_email) VALUES('$username', '$user_type', '$hash', '$email')";
			mysqli_query(
				$db,
				$query
			);
			$_SESSION['success']  = "New user successfully created!!";
			header('location: home');
		} else {
			$query = "INSERT INTO wp_users (user_login, role, user_pass, user_email) VALUES('$username', 'user', '$hash', '$email')";
			mysqli_query($db, $query);

			// get id of the created user
			$logged_in_user_id = mysqli_insert_id($db);

			$_SESSION['user'] = getUserById($logged_in_user_id); // put logged in user in session
			$_SESSION['success']  = "You are now logged in";
			header('location: dashboard');
		}
	}
}

// return user array from their id
function getUserById($id)
{
	global $db;
	$query = "SELECT * FROM wp_users WHERE id=" . $id;
	$result = mysqli_query($db, $query);

	$user = mysqli_fetch_assoc($result);
	return $user;
}

// LOGIN USER
function login()
{
	global $db, $username, $errors;
	$msg = '';
	$time = time() - 60;
	$ip_address = getIpAddr();

	$query1 = mysqli_query($db, "select count(*) as total_count from loginlogsnew where TryTime > $time and IpAddress='$ip_address'");
	$check_login_row = mysqli_fetch_assoc($query1);
	$total_count = $check_login_row['total_count'];
	//Checking if the attempt 5, or youcan set the no of attempt her. For now we taking only 5 fail attempted
	if ($total_count == 5) {
		array_push($errors, "Too many failed login attempts. Please login after 60 sec");
	} else {

		// grap form values
		$username = e($_POST['username']);
		$password = e($_POST['password']);

		// make sure form is filled properly
		if (empty($username)) {
			array_push($errors, "Username is required");
		}
		if (empty($password)) {
			array_push($errors, "Password is required");
		}

		$hasher = new PasswordHash(8, false);

		// attempt login if no errors on form
		if (count($errors) == 0) {
			$query = "SELECT user_pass FROM wp_users WHERE user_login='$username'";
			$results = mysqli_query($db, $query);

			if (mysqli_num_rows($results) == 1) {
				$row =  mysqli_fetch_assoc($results);

				if ($hasher->CheckPassword($password, $row["user_pass"])) {

					$query4 = "SELECT * FROM wp_users WHERE user_login='$username'";
					$results2 = mysqli_query($db, $query4);

					$query3 = "SELECT wp_users.* , wp_ea_staff.*  FROM `wp_users` INNER JOIN `wp_ea_staff` ON wp_users.user_email = wp_ea_staff.email  WHERE user_login='$username' ";
					$results3 = mysqli_query($db, $query3);

					$worker = mysqli_fetch_assoc($results3);

					// store username in cookie, to allow for session resumption by just entering password
					setcookie("user_login", $username, time() + (365 * 24 * 60 * 60));

					if (!empty($_POST["remember"])) {
						// save hashed password in a cookie for future authentication and login without needing entering of credentials manually
						$hashed_password = $row["user_pass"];
						setcookie(
							"user_pass",
							$hashed_password,
							time() + (365 * 24 * 60 * 60)
						);
					}

					$timezone = date_default_timezone_set('Africa/Nairobi');
					$currentDate = date('Y-m-d', time());
					$currentTime = date('G:i:s', time());
					$created = $currentDate . ' ' . $currentTime;

					mysqli_query($db, "DELETE FROM loginlogsnew WHERE IpAddress='$ip_address'");

					$logged_in_user = mysqli_fetch_assoc($results2);


					$_SESSION['role'] = $logged_in_user['role'];

					// random request suthentication string
					if (empty($_SESSION['_auth'])) $_SESSION['_auth'] = bin2hex(random_bytes(32));

					if ($logged_in_user['role'] == 'admin') {
						header('Location: dashboard');
					} else {
						header('Location: dashboard');

						$_SESSION['doctorid'] = $worker;
						$_SESSION['user'] = $logged_in_user;

						$query_one_user = mysqli_query($db, "UPDATE wp_users SET current_session = '" . session_id() . "'  WHERE user_login= '$username'");

						$_SESSION['success']  = "You are now logged in";
					}
				} else {
					$total_count++;
					$rem_attm = 5 - $total_count;
					if ($rem_attm == 0) {
						array_push($errors, "Too many failed login attempts. Please login after 60 sec");
					} else {
						array_push($errors, "Please enter valid login details.<br/>$rem_attm attempts remaining");
					}
					$try_time = time();
					mysqli_query($db, "INSERT INTO loginlogsnew (user_email, IpAddress,TryTime, attempt_date) VALUES('$username', '$ip_address','$try_time', NOW() )");
				}
			} else {
				$total_count++;
				$rem_attm = 5 - $total_count;
				if ($rem_attm == 0) {
					array_push($errors, "Too many failed login attempts. Please login after 60 sec");
				} else {
					array_push($errors, "Please enter valid login details.<br/>$rem_attm attempts remaining");
				}
				$try_time = time();
				mysqli_query($db, "INSERT INTO loginlogsnew (user_email, IpAddress,TryTime, attempt_date) VALUES('$username', '$ip_address','$try_time', NOW() )");
			}
		}
	}
}

// Getting IP Address
function getIpAddr()
{
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		$ipAddr = $_SERVER['HTTP_CLIENT_IP'];
	} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		$ipAddr = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} else {
		$ipAddr = $_SERVER['REMOTE_ADDR'];
	}
	return $ipAddr;
}

function isLoggedIn()
{
	if (isset($_SESSION['user'])) {
		return true;
	} else {
		return false;
	}
}

function isAdmin()
{
	if (isset($_SESSION['user']) && $_SESSION['user']['role'] == 'admin') {
		return true;
	} else {
		return false;
	}
}

// escape string
function e($val)
{
	global $db;
	return mysqli_real_escape_string($db, trim($val));
}

function display_error()
{
	global $errors;

	if (count($errors) > 0) {
		echo '<div class="errorz">';
		foreach ($errors as $error) {
			echo $error . '<br>';
		}
		echo '</div>';
	}
}


//SUBSCRIBTIO QUERY CHECK PACKAGE AND MODULES START
if (isset($_SESSION['doctorid'])) {
	$p_exprnce = $_SESSION['doctorid']['patient_experience'];
	if ($p_exprnce == 'patient_experience') {
		header('location: ../patientexperience/dashboard');
	}
}
//SUBSCRIBTIO QUERY CHECK PACKAGE AND MODULES END

/**
 * get subscription data
 * redirect to account setup if logged in user is subscribed and has not completed setup process
 */
if (isset($_SESSION['doctorid'])) {
	// subscription data for facility
	$facility_id = $_SESSION['doctorid']['facility_id'];
	$subscription_data_sql = "SELECT * FROM onemedpro_subscriptions WHERE facility_id = '$facility_id'";
	$subscription_data_res = mysqli_query($db, $subscription_data_sql);
	$subscription_data = mysqli_fetch_assoc($subscription_data_res);

	if (!empty($subscription_data)) {
		// if subscription is expired, redirect to subscription renewal page and set account as inactive
		$current_timestamp = new DateTime("now", new DateTimeZone("+3"));
		$subscription_expiry_date = new DateTime($subscription_data['subscription_expiry_date']);
		if (
			$current_timestamp > $subscription_expiry_date
			|| ($subscription_data['payment_status'] == "unpaid" && strtolower($subscription_data["package"]) !== "free")
		) {
			mysqli_query($db, "UPDATE onemedpro_subscriptions SET subscription_status = 0, payment_status = 'unpaid' WHERE facility_id = '$facility_id'");
			header("location: renew-subscription");
			// delete previously stored subscription data
			unset($_SESSION['subscription']);
		} else {
			// put subscription data in session only when subscription is active
			$path = explode(
				"/",
				$_SERVER['PHP_SELF']
			);
			array_pop($path);
			$directory = array_pop($path);

			if (
				(intval($subscription_data['account_setup']) < 4 || intval($subscription_data["account_setup"] == 5 && in_array(strtolower($subscription_data["package"]), ["premium", "platinum"])))
				&& basename($_SERVER['PHP_SELF'], ".php") !== "account-setup"
				&& $directory !== "operation"
			) header("location: account-setup");

			$_SESSION['subscription'] = $subscription_data;
		}
	}
} else{
	$_SESSION['subscription'] = '';
}

function authenticate_request()
{
	/**
	 * checks request headers and data to determine if it's a valid request. Valid requests should have a session set, a session authentication token, and an authentication token included with the request POST or GET data
	 * function can be extended to handle calls from external sources that will not have session set (if/when the day comes)
	 * 
	 * @return boolean
	 */

	global $db;

	if (
		session_status() !== PHP_SESSION_ACTIVE // session isn't active
		|| (empty($_SESSION["doctorid"]) && !check_for_remember_me($db)) // session variables not set, and persistent authentication not enabled
		|| empty($_SESSION["_auth"]) // session authentication token not set
		|| !(isset($_POST["token"]) || isset($_GET["token"])) // request authentication token not set
	) return false;

	$auth_token = isset($_POST["token"]) ? $_POST["token"] : $_GET["token"];
	if (!$auth_token == $_SESSION["_auth"]) return false; // request csrf token doesn't match session csrf token

	return true;
}

function check_for_remember_me(\mysqli $db)
{
	/**
	 * checks authentication cookies set when user clicks 'remember me'
	 * 	-> If they are present and valid, the user's data is stored in the session and they can continue to load pages.
	 * 	-> If they are absent or invalid, the user is redirected to login page
	 * 
	 * should ideally be ran when session has expired, i.e. $_SESSION['user'] and $_SESSION['doctorid'] are empty, to check if the user's credentials are stored in the browser before logging them out
	 * 
	 * @return boolean whether the user can be allowed to log in without entering credentials
	 */
	$is_authenticated = false;

	if (!(empty($_COOKIE["user_login"]) || empty($_COOKIE["user_pass"]))) {
		$user_login = $_COOKIE["user_login"];
		$user_password = $_COOKIE["user_pass"];

		$user_data = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM wp_users WHERE user_login = '$user_login'"));

		$password_match = $user_data["user_pass"] == $user_password;

		if ($password_match) {
			$_SESSION["user"] = $user_data;
			createOMPSession($user_login, $db);
			$is_authenticated = true;
		}
	}

	return $is_authenticated;
}

function verifyPassword(\mysqli $db, string $input_password, $user_login = "")
{
	/**
	 * Verifies that password entered by user matches hash stored in database.
	 * 
	 * @param mysqli $db database connection object, initialized in connect.php
	 * @param string $input_password password entered by user
	 * @param string $user_login optional username used for logging in. Can be passed as a parameter of gotten from cookies
	 * 
	 * @return bool true if password matches for provided username, false otherwise
	 */
	if (empty($user_login) && !isset($_COOKIE["user_login"])) return false;

	if (empty($user_login)) $user_login = $_COOKIE["user_login"];

	$saved_password = mysqli_fetch_assoc(mysqli_query($db, "SELECT user_pass FROM wp_users WHERE user_login = '$user_login'"))["user_pass"];

	$hasher = new PasswordHash(8, false);

	return $hasher->CheckPassword($input_password, $saved_password);
}

function createOMPSession(string $user_login, \mysqli $db)
{
	/**
	 * Creates session for user whose username is passed to function, and populates session variables.
	 * 
	 * @param string $user_login username for user whose session to create
	 * 
	 * @return void
	 */

	session_start();
	$session_id = session_id();
	$ip_address = getIpAddr();
	$doctor_data = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM wp_ea_staff WHERE email = '$user_login'"));
	mysqli_query($db, "DELETE FROM loginlogsnew WHERE IpAddress = '$ip_address'");
	mysqli_query($db, "UPDATE wp_users SET current_session = '$session_id' WHERE user_login = '$user_login'");

	if (empty($_SESSION["user"])) {
		$_SESSION["user"] = mysqli_fetch_assoc(mysqli_query($db, "SELECT * FROM wp_users WHERE user_login = '$user_login'"));
	}
	$_SESSION["doctorid"] = $doctor_data;
	$_SESSION["_auth"] = bin2hex(random_bytes(32));
}