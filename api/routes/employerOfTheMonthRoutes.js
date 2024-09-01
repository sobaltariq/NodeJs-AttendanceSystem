const express = require("express");
const employerOfTheMonthController = require("../controllers/employerOfTheMonthController");

// Employer of the Month routes
const router = express.Router();

router.post("/", employerOfTheMonthController.createEmployerOfTheMonth);
router.get("/", employerOfTheMonthController.getAllEmployersOfTheMonth);
router.get("/:id", employerOfTheMonthController.getEmployerOfTheMonthById);
router.put("/:id", employerOfTheMonthController.updateEmployerOfTheMonth);
router.delete("/:id", employerOfTheMonthController.deleteEmployerOfTheMonth);

module.exports = router;
