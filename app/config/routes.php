<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');
/**
 * ------------------------------------------------------------------
 * LavaLust - an opensource lightweight PHP MVC Framework
 * ------------------------------------------------------------------
 *
 * MIT License
 *
 * Copyright (c) 2020 Ronald M. Marasigan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @package LavaLust
 * @author Ronald M. Marasigan <ronald.marasigan@yahoo.com>
 * @since Version 1
 * @link https://github.com/ronmarasigan/LavaLust
 * @license https://opensource.org/licenses/MIT MIT License
 */

/*
| -------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------
| Here is where you can register web routes for your application.
|
|
*/
/** @var object $router **/

$router->get('/', 'Welcome::index');

$router->get('create-migration/{migration_class}', 'MigrationController::create_migration');
$router->get('migrate', 'MigrationController::migrate');
$router->get('rollback', 'MigrationController::rollback');
$router->get('rollback-all', 'MigrationController::rollback_all');
$router->get('refresh', 'MigrationController::refresh');
$router->get('status', 'MigrationController::status');


// Authentication
$router->post('login', 'AuthApiController::login');
$router->post('logout', 'AuthApiController::logout');
$router->post('refresh', 'AuthApiController::refresh');

$router->post('register', 'AuthApiController::create');


// Protected profile
$router->get('profile', 'AuthApiController::profile')
       ->middleware('jwt_auth');


// User creation
$router->post('users', 'AuthApiController::create');


// Protected Product CRUD
$router->get('products', 'ProductApiController::index')
       ->middleware('jwt_auth');

$router->get('products/{id}', 'ProductApiController::show')
       ->middleware('jwt_auth');

$router->post('products', 'ProductApiController::create')
       ->middleware('jwt_auth');

$router->put('products/{id}', 'ProductApiController::update')
       ->middleware('jwt_auth');

$router->patch('products/{id}', 'ProductApiController::update')
       ->middleware('jwt_auth');

$router->delete('products/{id}', 'ProductApiController::delete')
       ->middleware('jwt_auth');


// TEMPORARY DB TEST — remove after testing
$router->get('/test-db', function() {
    header('Content-Type: application/json');
    echo json_encode(database_config());
});