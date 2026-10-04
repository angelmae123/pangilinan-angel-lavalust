<?php

class AuthApiController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->call->library('api');
        $this->call->database();
    }

    public function login()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();

        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        $stmt = $this->db->raw(
            'SELECT * FROM users WHERE username = ?',
            [$username]
        );

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {

            $tokens = $this->api->issue_tokens([
                'id'   => $user['id'],
                'role' => $user['role'],
            ]);

            $this->api->respond($tokens);

        } else {

            $this->api->respond_error(
                'Invalid credentials',
                401
            );
        }
    }

    public function logout()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();

        $this->api->revoke_refresh_token(
            $input['refresh_token'] ?? ''
        );

        $this->api->respond([
            'message' => 'Logged out'
        ]);
    }

    public function profile()
    {
        $auth = $this->api->require_jwt();

        $stmt = $this->db->raw(
            'SELECT id, username, email, role, created_at
             FROM users
             WHERE id = ?',
            [$auth['sub']]
        );

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->api->respond(
            $user ?: ['message' => 'User not found']
        );
    }

    public function refresh()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();

        $this->api->refresh_access_token(
            $input['refresh_token'] ?? ''
        );
    }
}