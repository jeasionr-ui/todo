// 用户DTO（数据传输对象）
export class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.avatar = user.avatar;
    this.bio = user.bio;
    this.phone = user.phone;
    this.country = user.country;
    this.city = user.city;
    this.state = user.state;
    this.postalCode = user.postalCode;
    this.taxId = user.taxId;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLogin = user.lastLogin;
    this.twoFactorEnabled = user.twoFactorEnabled;
    this.role = user.role;
    this.status = user.status;
    this.socialAccounts = user.socialAccounts;
    this.loginHistory = user.loginHistory;
  }
}
