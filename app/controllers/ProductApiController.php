<?php

class ProductApiController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->call->library('api');
        $this->call->database();
    }

    public function index()
    {
        $products = $this->db->raw(
            "SELECT id, product_name, description, price, quantity, created_at 
             FROM products"
        );

        $data = $products->fetchAll(PDO::FETCH_ASSOC);

        $this->api->respond($data);
    }

    public function show($id)
    {
        $stmt = $this->db->raw(
            "SELECT * FROM products WHERE id = ?",
            [$id]
        );

        $product = $stmt->fetch(PDO::FETCH_ASSOC);


        if (!$product) {
            $this->api->respond_error(
                "Product not found",
                404
            );
            return;
        }


        $this->api->respond($product);
    }

    public function create()
    {
        $this->api->require_method('POST');


        $input = $this->api->body();


        $stmt = $this->db->raw(
            "INSERT INTO products
            (
                product_name,
                description,
                price,
                quantity,
                created_at
            )
            VALUES (?, ?, ?, ?, NOW())",
            [
                $input['product_name'],
                $input['description'],
                $input['price'],
                $input['quantity']
            ]
        );


        $this->api->respond([
            "message"=>"Product created"
        ],201);
    }


    public function update($id)
    {
        $this->api->require_method('PUT');


        $input = $this->api->body();


        $this->db->raw(
            "UPDATE products SET
            product_name=?,
            description=?,
            price=?,
            quantity=?
            WHERE id=?",
            [
                $input['product_name'],
                $input['description'],
                $input['price'],
                $input['quantity'],
                $id
            ]
        );


        $this->api->respond([
            "message"=>"Product updated"
        ]);
    }


    public function delete($id)
    {
        $this->api->require_method('DELETE');


        $this->db->raw(
            "DELETE FROM products WHERE id=?",
            [$id]
        );


        $this->api->respond([
            "message"=>"Product deleted"
        ]);
    }

}