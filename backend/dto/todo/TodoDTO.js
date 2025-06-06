// 任务DTO（数据传输对象）
export class TodoDTO {
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
