import Joi from "joi";

export const schemas = {
  registerUserSchema: Joi.object().keys({
    email: Joi.string().email().label("email").required(),
    password: Joi.string().min(5).max(10).label("password").required(),
    firstName: Joi.string().label("firstName").optional(),
    lastName: Joi.string().label("lastName").optional(),
  }),

  loginUserSchema: Joi.object().keys({
    email: Joi.string().email().label("email").required(),
    password: Joi.string().min(5).max(10).label("password").required(),
  }),

  addTaskSchema: Joi.object().keys({
    title: Joi.string().label("title").required(),
    description: Joi.string().label("description").optional(),
  }),

  updateTaskSchema: Joi.object().keys({
    title: Joi.string().label("title").optional(),
    description: Joi.string().label("description").optional(),
    status: Joi.string()
      .label("status")
      .valid("OPEN", "IN_PROGRESS", "DONE")
      .optional(),
  }),

  updateTaskStatusSchema: Joi.object().keys({
    status: Joi.string()
      .label("status")
      .valid("OPEN", "IN_PROGRESS", "DONE")
      .required(),
  }),

  createNotificationSchema: Joi.object().keys({
    type: Joi.string()
      .label("type")
      .valid(
        "USER_CREATED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_STATUS_UPDATED",
        "TASK_DELETED"
      )
      .required(),
    description: Joi.string().label("description").required(),
  }),

  userSchema: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    createdAt: true,
  },
};
