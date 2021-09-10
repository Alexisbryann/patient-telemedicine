<?php

/**
 * This code was generated by
 * \ / _    _  _|   _  _
 * | (_)\/(_)(_|\/| |(/_  v1.0.0
 * /       /
 */

namespace Twilio\Rest\FlexApi\V1;

use Twilio\Deserialize;
use Twilio\Exceptions\TwilioException;
use Twilio\InstanceResource;
use Twilio\Options;
use Twilio\Values;
use Twilio\Version;

/**
 * @property string $accountSid
 * @property \DateTime $dateCreated
 * @property \DateTime $dateUpdated
 * @property string $sid
 * @property string $friendlyName
 * @property string $chatServiceSid
 * @property string $channelType
 * @property string $contactIdentity
 * @property bool $enabled
 * @property string $integrationType
 * @property array $integration
 * @property bool $longLived
 * @property bool $janitorEnabled
 * @property string $url
 */
class FlexFlowInstance extends InstanceResource {
    /**
     * Initialize the FlexFlowInstance
     *
     * @param \Twilio\Version $version Version that contains the resource
     * @param mixed[] $payload The response payload
     * @param string $sid The SID that identifies the resource to fetch
     * @return \Twilio\Rest\FlexApi\V1\FlexFlowInstance
     */
    public function __construct(Version $version, array $payload, $sid = null) {
        parent::__construct($version);

        // Marshaled Properties
        $this->properties = array(
            'accountSid' => Values::array_get($payload, 'account_sid'),
            'dateCreated' => Deserialize::dateTime(Values::array_get($payload, 'date_created')),
            'dateUpdated' => Deserialize::dateTime(Values::array_get($payload, 'date_updated')),
            'sid' => Values::array_get($payload, 'sid'),
            'friendlyName' => Values::array_get($payload, 'friendly_name'),
            'chatServiceSid' => Values::array_get($payload, 'chat_service_sid'),
            'channelType' => Values::array_get($payload, 'channel_type'),
            'contactIdentity' => Values::array_get($payload, 'contact_identity'),
            'enabled' => Values::array_get($payload, 'enabled'),
            'integrationType' => Values::array_get($payload, 'integration_type'),
            'integration' => Values::array_get($payload, 'integration'),
            'longLived' => Values::array_get($payload, 'long_lived'),
            'janitorEnabled' => Values::array_get($payload, 'janitor_enabled'),
            'url' => Values::array_get($payload, 'url'),
        );

        $this->solution = array('sid' => $sid ?: $this->properties['sid'], );
    }

    /**
     * Generate an instance context for the instance, the context is capable of
     * performing various actions.  All instance actions are proxied to the context
     *
     * @return \Twilio\Rest\FlexApi\V1\FlexFlowContext Context for this
     *                                                 FlexFlowInstance
     */
    protected function proxy() {
        if (!$this->context) {
            $this->context = new FlexFlowContext($this->version, $this->solution['sid']);
        }

        return $this->context;
    }

    /**
     * Fetch a FlexFlowInstance
     *
     * @return FlexFlowInstance Fetched FlexFlowInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function fetch() {
        return $this->proxy()->fetch();
    }

    /**
     * Update the FlexFlowInstance
     *
     * @param array|Options $options Optional Arguments
     * @return FlexFlowInstance Updated FlexFlowInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function update($options = array()) {
        return $this->proxy()->update($options);
    }

    /**
     * Deletes the FlexFlowInstance
     *
     * @return boolean True if delete succeeds, false otherwise
     * @throws TwilioException When an HTTP error occurs.
     */
    public function delete() {
        return $this->proxy()->delete();
    }

    /**
     * Magic getter to access properties
     *
     * @param string $name Property to access
     * @return mixed The requested property
     * @throws TwilioException For unknown properties
     */
    public function __get($name) {
        if (array_key_exists($name, $this->properties)) {
            return $this->properties[$name];
        }

        if (property_exists($this, '_' . $name)) {
            $method = 'get' . ucfirst($name);
            return $this->$method();
        }

        throw new TwilioException('Unknown property: ' . $name);
    }

    /**
     * Provide a friendly representation
     *
     * @return string Machine friendly representation
     */
    public function __toString() {
        $context = array();
        foreach ($this->solution as $key => $value) {
            $context[] = "$key=$value";
        }
        return '[Twilio.FlexApi.V1.FlexFlowInstance ' . implode(' ', $context) . ']';
    }
}