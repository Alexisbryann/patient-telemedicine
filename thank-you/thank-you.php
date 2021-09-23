<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You | My Health Africa </title>
    <link rel="stylesheet" href="css/thankyou.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.6/css/line.css">
    <!-- favicon -->
	<link rel="shortcut icon" href="../images/my-health-africa.png" />
    <style>
    body, h1, h2, h3, h4, h5, h6,p  {
      font-family: "Segoe UI";
    }
    </style>

</head>
  <body >
    <section class = "container well " >
        
          <img src = "images/logo_group.png" class = "img-responsive logo-image" alt = "My health africa, tunza clinics & psi logos">
        
          <h3 style="font-size:30px;font-weight:bold;margin-bottom: 10px;">Thank you for having a telemedicine appointment with </h3>
          <h3 style="font-size:30px;font-weight:bold;margin-bottom: 40px;">Tunza clinics.</h3>
       
          <p style="font-size:22px;font-weight:semibold;margin-bottom: 20px;">Invite a friend who may need to consult a doctor.</p>
          <button class="view-modal" type = "button" style="font-size:16px;font-weight:semibold margin-top: 30px;">Invite A Friend</button>

      <div id = "pop-up" class="popup">
          <header>
            <span>Invite friends and family </span>
            <div class="close"><i class="uil uil-times"></i></div>
          </header>

    <div class="content">
      <p style="font-size:13px;font-weight:semibold">Share this link via</p>
      <ul class="icons">

        <a href="https://www.facebook.com/sharer.php?u=https://www.myhealthafrica.com/talk-to-a-tunza-daktari-online/&quote=Hey, get your telemedicine consultation" target="blank" rel="noopener noreferrer"><i class="fab fa-facebook-f" alt="Share on Facebook"></i></a>

        <a href="https://twitter.com/intent/tweet?text=Hey there, need a doctor? Talk to a Daktari now from the comfort of your home. Its very easy, check it out! +https://www.myhealthafrica.com/talk-to-a-tunza-daktari-online/" target="blank" rel="noopener noreferrer"><i class="fab fa-twitter" alt="Share on Twitter"></i></a>

        <a href="https://api.whatsapp.com/send?text=Hey there, need a doctor? Talk to a Daktari now from the comfort of your home. Its very easy, check it out! +https://www.myhealthafrica.com/talk-to-a-tunza-daktari-online/" target="blank"><i class="fab fa-whatsapp" alt="Share on Whatsapp"></i></a>

        <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.myhealthafrica.com/talk-to-a-tunza-daktari-online/&title=Hey, get your telemedicine consultation" target="blank"><i class="fab fa-linkedin-in" alt="Share on LinkedIn"></i></a>
      </ul>
      <p style="font-size:13px;font-weight:semibold">Or copy link</p>
      <div class="field">
        <i class="url-icon uil uil-link"></i>
        <input type="text" readonly value="https://www.myhealthafrica.com/talk-to-a-tunza-daktari-online">
        <button>Copy</button>
      </div>
    </div>
  </div>
    
    </section>

    <script>
    const viewBtn = document.querySelector(".view-modal"),
    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    copy = field.querySelector("button");

    viewBtn.onclick = ()=>{
      popup.classList.toggle("show");
      
    }
    close.onclick = ()=>{
      viewBtn.click();
    }

    copy.onclick = ()=>{
      input.select(); 
      if(document.execCommand("copy")){ 
        field.classList.add("active");
        copy.innerText = "Copied";
        setTimeout(()=>{
          window.getSelection().removeAllRanges(); 
          field.classList.remove("active");
          copy.innerText = "Copy";
        }, 3000);
      }
    } 

  </script>
  </body>

</html>
