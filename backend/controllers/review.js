
const pool = require("../models/db");


const createReview=(req,res)=>{
    const {u_id,p_id,rating,comment}=req.body;
    const product_id = p_id;

    const user_id = u_id//req.token.userId;

    const query = `INSERT INTO reviews (product_id, user_id, rating,comment) VALUES ($1,$2,$3,$4) RETURNING *;`;
    const data = [product_id, user_id, rating,comment];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "review created successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });

};
const updateReview=(req,res)=>{
    const {rating,comment}=req.body;
    const id =req.params.id
    

   // const user_id = u_id//req.token.userId;

    const query = `UPDATE reviews  SET comment=$3,rating=$2 WHERE id=$1 RETURNING *;`;
    const data = [id, rating,comment];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "review updated successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });

};
const removeReview=(req,res)=>{
    const id=req.params.id;

   // const user_id = u_id//req.token.userId;

    const query = `DELETE FROM reviews WHERE id=$1 RETURNING *;`;
    const data = [id];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "review removed successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });


};
const getProductReviews=(req,res)=>{
    const product_id=req.params.id;
    

   // const user_id = u_id//req.token.userId;

    const query = `SELECT * FROM reviews WHERE product_id=$1 ;`;
    const data = [product_id];
    pool
      .query(query, data)
      .then((result) => {
        console.log(result.rows)
        res.status(200).json({
          success: true,
          message: "review selected successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });


};
const createSellerReviews=(req,res)=>{
    const {user_id,rating,comment}=req.body;
const id=req.params.id
    

    const query = `INSERT INTO sellerreviews (seller_id, user_id, rating,comment) VALUES ($1,$2,$3,$4) RETURNING *;`;
    const data = [id, user_id, rating,comment];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "review created successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });


};
const getSellerReviews=(req,res)=>{
    const id=req.params.id;
    

    const query = `SELECT * FROM sellerreviews WHERE seller_id=$1 ;`;
    const data = [id];
    pool
      .query(query, data)
      .then((result) => {
        console.log(result.rows)
        res.status(200).json({
          success: true,
          message: "seller reviews selected successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });



};
const updateSellerReviews=(req,res)=>{
    const {rating,comment}=req.body;
    const id =req.params.id
    

   // const user_id = u_id//req.token.userId;

    const query = `UPDATE sellerreviews  SET comment=$3,rating=$2 WHERE id=$1 RETURNING *;`;
    const data = [id, rating,comment];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "review updated successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });

};
const removeSellerReviews=(req,res)=>{
    const id=req.params.id;

   // const user_id = u_id//req.token.userId;

    const query = `DELETE FROM sellerreviews WHERE id=$1;`;
    const data = [id];
    pool
      .query(query, data)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "sellerreview removed successfully",
          result: result.rows[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });



};
module.exports = {createReview,updateReview,removeReview,getProductReviews,createSellerReviews,getSellerReviews,updateSellerReviews,removeSellerReviews};



