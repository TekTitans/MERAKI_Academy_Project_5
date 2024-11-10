const express = require("express");

const {
  createNewRole,
  createNewPermission,
  createNewRolePermission,
} = require("../controllers/role");

const rolesRouter = express.Router();

rolesRouter.post("/", createNewRole);
rolesRouter.post("/permission", createNewPermission);
rolesRouter.post("/role_permission", createNewRolePermission);

module.exports = rolesRouter;

/*
 * Testing Object:
{
  "role": "Admin"
}

{
  "permission": "READ_ALL_USERS"
}

{
  "role_id": 1,
  "permission_id": 1
}

*/
