// 任务实体定义（与数据库结构对应）
export class TodoType {
  constructor(task) {
    this.id = task.id;
    this.name = task.name;
    this.description = task.description;
    this.status = task.status;
    this.priority = task.priority;
    this.dueDate = task.dueDate;
    this.reminderTime = task.reminderTime;
    this.tags = task.tags;
    this.attachments = task.attachments;
  }
}
