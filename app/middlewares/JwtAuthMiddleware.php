<?php

defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class JwtAuthMiddleware
{
    public function handle(Closure $next)
    {
        $lava = lava_instance();

        $lava->call->database();
        $lava->call->library('api');

        $lava->api->require_jwt();

        return $next();
    }
}