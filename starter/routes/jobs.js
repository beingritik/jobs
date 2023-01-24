const express = require("express");
const jobrouter = express.Router();
const {
  createJob,
  getAllJobs,
  deleteJob,
  getSingleJob,
  updateJob
} = require("../controllers/jobs");

jobrouter
  .post("/create", createJob)
  .get("/getall", getAllJobs)
  .get("/:id", getSingleJob);

jobrouter
.route("/:id")
.delete(deleteJob)
.patch(updateJob)


module.exports = jobrouter;
