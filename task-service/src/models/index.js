// src/models/index.js
import { Task } from "./task.model.js";
import { Subtask } from "./subtask.model.js";
import { TaskHistory } from "./task_history.model.js";
import { Comment } from "./comment.model.js";
import { CommentHistory } from "./comment_history.model.js";

export default function initModels() {

  Task.hasMany(Subtask, {
    foreignKey: "task_id",
    as: "subtasks",
  });
  Subtask.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
  });


  Task.hasMany(TaskHistory, {
    foreignKey: "task_id",
    as: "history",
  });
  TaskHistory.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
  });


  Task.hasMany(Comment, {
    foreignKey: "task_id",
    as: "comments",
  });
  Comment.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
  });

  Comment.hasMany(CommentHistory, {
    foreignKey: "comment_id",
    as: "history",
  });
  CommentHistory.belongsTo(Comment, {
    foreignKey: "comment_id",
    as: "comment",
  });
}

export { Task, Subtask, TaskHistory, Comment, CommentHistory };
