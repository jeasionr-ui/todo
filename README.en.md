# ToDo Project Management System

English | [中文](./README.md)

A modern ToDo project management system based on Vue 3 and Node.js, designed to help users efficiently manage tasks, habits, and goals.

## ⚠️ Important Notes

### 🚧 Development Status
- **Project Status**: Rapid iterative development in progress, features continuously improving
- **Stability**: Some features may have bugs, recommended for learning and reference
- **Data Backup**: Regular backup of important data recommended to avoid data loss
- **Version Compatibility**: New versions may not be backward compatible, please backup before upgrading

### 🔧 Technical Requirements
- **Node.js Version**: Requires 16.0+ version, LTS version recommended
- **Database**: Supports MySQL 8.0+ or PostgreSQL 12.0+
- **Browser**: Modern browsers recommended (Chrome 90+, Firefox 88+, Safari 14+)
- **Development Environment**: VS Code with relevant plugins recommended

### 📱 Feature Limitations
- **Mobile**: Current version mainly optimized for desktop, limited mobile experience
- **Multi-user**: Multi-user collaboration features not yet supported
- **Offline Mode**: Network connection required for normal use
- **File Size**: Upload files recommended not to exceed 10MB

### 🔒 Security Reminders
- **Password Security**: Use strong passwords, change regularly
- **Data Privacy**: Pay attention to server security configuration when deploying locally
- **Production Environment**: Modify default configurations and keys before production deployment
- **HTTPS**: HTTPS recommended for production environment

### 🐛 Known Issues
- **Data Sync**: Occasional frontend-backend data synchronization issues
- **File Upload**: Large file uploads may timeout
- **Theme Switching**: Some component styles in dark theme need optimization
- **Browser Compatibility**: IE browser not supported

### 💡 Usage Recommendations
- **First Use**: Recommended to read documentation first to understand basic features
- **Data Import**: Bulk import existing data through API
- **Performance Optimization**: Regular cleanup of unused data and files recommended
- **Issue Feedback**: Please report issues through GitHub Issues

## 📖 Project Overview

This project is a feature-rich personal productivity management tool that integrates multiple core modules including task management, habit formation, goal setting, and time management. It adopts a frontend-backend separation architecture design, providing a modern user interface and powerful functional extensibility.

## ✨ Core Features

### 🎯 Task Management
- Task creation/editing and status management (Todo, In Progress, Completed)
- Task priority, tags, and attachment management
- Support for task drag-and-drop sorting and categorization
- Task dependency relationship setting
- Task time estimation and actual time tracking
- Batch operations (batch edit, delete, mark complete)

### 🏃‍♂️ Habit Formation
- Habit creation/editing and completion record management
- Habit check-in calendar view
- Habit streak statistics and reward system
- Habit formation progress visualization
- Habit categorization and tag management
- Frequency settings (daily, weekly, custom)
- Habit statistics and trend analysis
- Check-in reminder functionality

### 🎯 Goal Management
- Goal breakdown into sub-goals and tasks
- Goal progress tracking and visualization
- Goal timeline and milestone setting
- Goal review and reflection functionality
- Goal categorization and priority management
- Goal-task association functionality
- Automatic progress calculation and updates
- Goal statistics and completion rate analysis

### 🍅 Pomodoro Time Management
- Classic Pomodoro Technique implementation (25-minute work, 5-minute break)
- Customizable work and break time lengths
- Pomodoro-task integration functionality
- Pomodoro statistics and visualization reports
- Focus mode (auto-disable notifications, fullscreen mode, etc.)
- Template management system (preset and custom templates)
- Session management (pause, resume, cancel)
- Productivity rating and mood tracking
- Real-time statistics and historical data analysis

### 👤 User Management
- User registration, login, and profile management
- User profile completion and personalization settings
- User avatar upload and editing
- Account security settings (password change, two-factor authentication)

### 📊 Reports and Analytics
- Personal productivity analysis
- Habit formation trend analysis
- Goal completion rate and deviation analysis
- Time utilization efficiency reports
- Pomodoro focus time statistics
- Task completion analysis
- Comprehensive dashboard data display
- Custom reports and data export

## 🏗️ Project Architecture

```
todo/
├── front/                    # Frontend Application (Vue 3 + TypeScript)
│   ├── src/
│   │   ├── components/       # Component Library
│   │   │   ├── common/       # Common Components
│   │   │   ├── goals/        # Goal Management Components
│   │   │   ├── habits/       # Habit Management Components
│   │   │   ├── pomodoro/     # Pomodoro Components
│   │   │   ├── reports/      # Report Components
│   │   │   └── tasks/        # Task Components
│   │   ├── views/           # Page Views
│   │   │   ├── Dashboard.vue # Dashboard
│   │   │   ├── Goals/        # Goal Management Pages
│   │   │   ├── Habits/       # Habit Management Pages
│   │   │   ├── Pomodoro/     # Pomodoro Pages
│   │   │   ├── Reports/      # Report Pages
│   │   │   └── Tasks/        # Task Management Pages
│   │   ├── services/        # API Services
│   │   │   ├── goalService.ts
│   │   │   ├── habitService.ts
│   │   │   ├── pomodoroService.ts
│   │   │   ├── reportService.ts
│   │   │   └── taskService.ts
│   │   ├── router/          # Router Configuration
│   │   ├── types/           # TypeScript Type Definitions
│   │   └── assets/          # Static Assets
│   └── ...
├── backend/                  # Backend Service (Node.js + Express)
│   ├── api/                 # API Route Layer
│   │   ├── goal/            # Goal Management API
│   │   ├── habit/           # Habit Management API
│   │   ├── pomodoro/        # Pomodoro API
│   │   ├── report/          # Report API
│   │   └── task/            # Task Management API
│   ├── biz/                 # Business Logic Layer
│   │   ├── goal/            # Goal Business Logic
│   │   ├── habit/           # Habit Business Logic
│   │   ├── pomodoro/        # Pomodoro Business Logic
│   │   ├── report/          # Report Business Logic
│   │   └── task/            # Task Business Logic
│   ├── db/                  # Data Access Layer
│   │   ├── goal/            # Goal Data Operations
│   │   ├── habit/           # Habit Data Operations
│   │   ├── pomodoro/        # Pomodoro Data Operations
│   │   ├── report/          # Report Data Operations
│   │   └── task/            # Task Data Operations
│   ├── dto/                 # Data Transfer Objects
│   │   ├── goal/            # Goal DTOs
│   │   ├── habit/           # Habit DTOs
│   │   ├── pomodoro/        # Pomodoro DTOs
│   │   ├── report/          # Report DTOs
│   │   └── todo/            # Task DTOs
│   ├── entity/              # Entity Definitions
│   │   ├── goal/            # Goal Entities
│   │   ├── habit/           # Habit Entities
│   │   ├── pomodoro/        # Pomodoro Entities
│   │   └── todo/            # Task Entities
│   └── ...
└── README.md                # Project Documentation
```

## 🚀 Technology Stack

### Frontend Technologies
- **Framework**: Vue 3.5+ (Composition API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0+
- **Router**: Vue Router 4.5+
- **State Management**: Pinia
- **Build Tool**: Vite
- **UI Components**: Custom Component Library

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/PostgreSQL
- **API Design**: RESTful API
- **Architecture Pattern**: Layered Architecture (API-BIZ-DB)

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Standards**: ESLint + Prettier
- **Type Checking**: TypeScript

## 📦 Quick Start

### ⚠️ Pre-deployment Preparation

#### Environment Check
```bash
# Check Node.js version
node --version  # Should be >= 16.0.0

# Check npm version
npm --version   # Should be >= 8.0.0

# Check database connection
mysql --version  # or psql --version
```

#### Configuration File Setup
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env file to configure database connection and other information

# Frontend configuration (if needed)
cp front/.env.example front/.env
```

### Requirements
- Node.js 16.0+
- npm 8.0+
- MySQL 8.0+ or PostgreSQL 12.0+

### Installation and Setup

1. **Clone the project**
```bash
git clone https://github.com/jeasionr-ui/todo.git
cd todo
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd front
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure database**
```bash
# Create database (MySQL example)
mysql -u root -p -e "CREATE DATABASE todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import database structure
mysql -u root -p todo_db < backend/init.sql

# Configure database connection information
# Edit backend/.env file to set correct database connection parameters
```

**⚠️ Database Configuration Notes:**
- Ensure database service is running
- Database user needs permissions to create tables and insert data
- Character set recommended to use utf8mb4 to support emoji and other special characters
- First run will automatically create necessary table structures

4. **Start services**
```bash
# Start backend service (port: 3000)
cd backend
npm run dev

# Start frontend development server (port: 5173)
cd ../front
npm run dev
```

**⚠️ Service Startup Notes:**
- Please start backend service first, then frontend service
- Ensure ports 3000 and 5173 are not occupied by other programs
- First startup may take a few minutes to install dependencies
- If startup fails, please check Node.js version and dependency installation

5. **Access the application**
- Frontend application: http://localhost:5173
- Backend API: http://localhost:3000

## 📚 Project Documentation

- [Frontend Development Documentation](./front/README.md) - Vue 3 frontend application development guide
- [Backend Development Documentation](./backend/README.md) - Node.js backend service development guide
- [API Interface Documentation](./backend/README.md#api-documentation) - RESTful API interface specification

## 🤝 Contributing

We welcome all forms of contributions, including but not limited to:

- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

### Commit Guidelines

Please follow this commit message format:
```
type(scope): description

[optional body]

[optional footer]
```

Type descriptions:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code format adjustment
- `refactor`: Refactoring
- `test`: Testing related
- `chore`: Build configuration, etc.

## 📄 License

This project uses a non-commercial license.

### License Overview

**Copyright © 2025 Kim**

- ✅ **Personal Use**: Free use for individuals, educational institutions, non-profit organizations for non-commercial purposes
- ✅ **Modification and Distribution**: May modify and distribute, but must retain copyright notice and license information
- ✅ **Open Source Requirement**: Modified versions must remain open source and indicate modifications
- ❌ **Commercial Use**: Any commercial use requires a separate commercial license

### Commercial Licensing

For commercial use (selling, leasing, providing paid services, integrating into commercial products, etc.), please contact for commercial licensing:

- 📧 Email: jeasionr@foxmail.com
- 🌐 Project URL: https://github.com/jeasionr-ui/todo

Commercial licensing includes value-added services such as technical support and custom development.

### Disclaimer

This software is provided "as is" without any express or implied warranties. The author is not liable for any damages arising from the use of this software.

For detailed license terms, please see the [LICENSE](./LICENSE) file.

## 🔧 Troubleshooting

### Common Issues

#### Startup Failure
```bash
# Clean dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port occupation
lsof -i :3000  # Check backend port
lsof -i :5173  # Check frontend port
```

#### Database Connection Issues
```bash
# Check database service status
# MySQL
sudo systemctl status mysql
# or brew services list | grep mysql

# PostgreSQL  
sudo systemctl status postgresql
# or brew services list | grep postgresql
```

#### Permission Issues
```bash
# macOS/Linux permission fix
sudo chown -R $(whoami) .
chmod -R 755 .
```

### 🔍 Debug Mode

Enable detailed logging for development debugging:
```bash
# Backend debug mode
cd backend
DEBUG=* npm run dev

# Frontend development mode already includes hot reload and error prompts
cd front
npm run dev
```

### 📞 Getting Help

If you encounter problems, you can get help through the following ways:

1. **Check Logs**: Review error messages in console output
2. **Search Documentation**: Check project Wiki and README documentation
3. **Submit Issue**: Create detailed problem reports on GitHub
4. **Community Discussion**: Participate in project discussion forums

**When submitting Issues, please include:**
- Operating system and version
- Node.js and npm versions
- Error messages and logs
- Reproduction steps
- Expected behavior

## 📞 Contact Us

- 📧 Email: jeasionr@foxmail.com
- 🌐 Project Homepage: https://github.com/jeasionr-ui/todo
- 📋 Issue Feedback: https://github.com/jeasionr-ui/todo/issues

## 🗺️ Development Roadmap

### Phase 1 ✅
- [x] Core functionality implementation
- [x] User management system
- [x] Basic task management
- [x] Simple reporting functionality

### Phase 2 ✅
- [x] Habit formation system
- [x] Goal management functionality
- [x] Pomodoro time management
- [x] Advanced calendar functionality
- [x] Reports and data analysis

### Phase 3 📋
- [ ] Social and collaboration features
- [ ] Advanced reports and data analysis
- [ ] Mobile application
- [ ] Performance optimization and experience enhancement

---

⭐ If this project helps you, please give us a Star!

A modern ToDo project management system based on Vue 3 and Node.js, designed to help users efficiently manage tasks, habits, and goals.

## ⚠️ Important Notes

### 🚧 Development Status
- **Project Status**: Rapid iterative development, continuous feature improvement
- **Stability**: Some features may have bugs, recommended for learning and reference
- **Data Backup**: Regular backup of important data recommended to avoid data loss
- **Version Compatibility**: New versions may not be backward compatible, backup before upgrading

### 🔧 Technical Requirements
- **Node.js Version**: Requires 16.0+ version, LTS version recommended
- **Database**: Supports MySQL 8.0+ or PostgreSQL 12.0+
- **Browser**: Modern browsers recommended (Chrome 90+, Firefox 88+, Safari 14+)
- **Development Environment**: VS Code with related plugins recommended

### 📱 Feature Limitations
- **Mobile**: Current version mainly optimized for desktop, limited mobile experience
- **Multi-user**: Multi-user collaboration not currently supported
- **Offline Mode**: Network connection required for normal use
- **File Size**: Uploaded files recommended not to exceed 10MB

### 🔒 Security Reminders
- **Password Security**: Use strong passwords, change regularly
- **Data Privacy**: Pay attention to server security configuration when deploying locally
- **Production Environment**: Modify default configurations and keys before production deployment
- **HTTPS**: HTTPS recommended for production environment

### 🐛 Known Issues
- **Data Sync**: Occasional frontend-backend data synchronization issues
- **File Upload**: Large file uploads may timeout
- **Theme Switching**: Some component styles need optimization in dark theme
- **Browser Compatibility**: IE browser not supported

### 💡 Usage Recommendations
- **First Use**: Read documentation first to understand basic features
- **Data Import**: Batch import existing data via API
- **Performance Optimization**: Regular cleanup of unused data and files recommended
- **Issue Feedback**: Report issues via GitHub Issues

## 📖 Project Overview

This project is a feature-rich personal productivity management tool that integrates multiple core modules including task management, habit building, goal setting, and time management. It adopts a frontend-backend separation architecture design, providing a modern user interface and powerful extensibility.

## ✨ Core Features

### 🎯 Task Management
- Task creation/editing and status management (todo, in progress, completed)
- Task priority, tags, and attachment management
- Support for task drag-and-drop sorting and categorization
- Task dependency relationship setting
- Task time estimation and actual time recording
- Batch operations (batch edit, delete, mark complete)

### 🏃‍♂️ Habit Building
- Habit creation/editing and completion record management
- Habit check-in calendar view
- Habit streak statistics and reward mechanism
- Habit progress visualization
- Habit categorization and tag management
- Frequency settings (daily, weekly, custom)
- Habit statistics and trend analysis
- Check-in reminder functionality

### 🎯 Goal Management
- Goal breakdown into sub-goals and tasks
- Goal progress tracking and visualization
- Goal timeline and milestone setting
- Goal review and reflection functionality
- Goal categorization and priority management
- Goal-task association functionality
- Automatic progress calculation and updates
- Goal statistics and completion rate analysis

### 🍅 Pomodoro Time Management
- Classic Pomodoro Technique implementation (25 minutes work, 5 minutes break)
- Custom work and break time lengths
- Pomodoro integration with tasks
- Pomodoro statistics and visualization reports
- Focus mode (auto-disable notifications, fullscreen mode, etc.)
- Template management system (preset and custom templates)
- Session management (pause, resume, cancel)
- Productivity rating and mood recording
- Real-time statistics and historical data analysis

### 👤 User Management
- User registration, login, and information management
- User profile completion and personalization settings
- User avatar upload and editing
- Account security settings (password change, two-factor authentication)

### 📊 Reports and Analysis
- Personal productivity analysis
- Habit building trend analysis
- Goal completion rate and deviation analysis
- Time utilization efficiency reports
- Pomodoro focus time statistics
- Task completion analysis
- Comprehensive dashboard data display
- Custom reports and data export

## 🏗️ Project Architecture

```
todo/
├── front/                    # Frontend Application (Vue 3 + TypeScript)
│   ├── src/
│   │   ├── components/       # Component Library
│   │   │   ├── common/       # Common Components
│   │   │   ├── goals/        # Goal Management Components
│   │   │   ├── habits/       # Habit Management Components
│   │   │   ├── pomodoro/     # Pomodoro Components
│   │   │   ├── reports/      # Report Components
│   │   │   └── tasks/        # Task Components
│   │   ├── views/           # Page Views
│   │   │   ├── Dashboard.vue # Dashboard
│   │   │   ├── Goals/        # Goal Management Pages
│   │   │   ├── Habits/       # Habit Management Pages
│   │   │   ├── Pomodoro/     # Pomodoro Pages
│   │   │   ├── Reports/      # Report Pages
│   │   │   └── Tasks/        # Task Management Pages
│   │   ├── services/        # API Services
│   │   │   ├── goalService.ts
│   │   │   ├── habitService.ts
│   │   │   ├── pomodoroService.ts
│   │   │   ├── reportService.ts
│   │   │   └── taskService.ts
│   │   ├── router/          # Route Configuration
│   │   ├── types/           # TypeScript Type Definitions
│   │   └── assets/          # Static Assets
│   └── ...
├── backend/                  # Backend Service (Node.js + Express)
│   ├── api/                 # API Route Layer
│   │   ├── goal/            # Goal Management API
│   │   ├── habit/           # Habit Management API
│   │   ├── pomodoro/        # Pomodoro API
│   │   ├── report/          # Report API
│   │   └── task/            # Task Management API
│   ├── biz/                 # Business Logic Layer
│   │   ├── goal/            # Goal Business Logic
│   │   ├── habit/           # Habit Business Logic
│   │   ├── pomodoro/        # Pomodoro Business Logic
│   │   ├── report/          # Report Business Logic
│   │   └── task/            # Task Business Logic
│   ├── db/                  # Data Access Layer
│   │   ├── goal/            # Goal Data Operations
│   │   ├── habit/           # Habit Data Operations
│   │   ├── pomodoro/        # Pomodoro Data Operations
│   │   ├── report/          # Report Data Operations
│   │   └── task/            # Task Data Operations
│   ├── dto/                 # Data Transfer Objects
│   │   ├── goal/            # Goal DTO
│   │   ├── habit/           # Habit DTO
│   │   ├── pomodoro/        # Pomodoro DTO
│   │   ├── report/          # Report DTO
│   │   └── todo/            # Task DTO
│   ├── entity/              # Entity Definitions
│   │   ├── goal/            # Goal Entities
│   │   ├── habit/           # Habit Entities
│   │   ├── pomodoro/        # Pomodoro Entities
│   │   └── todo/            # Task Entities
│   └── ...
└── README.md                # Project Documentation
```

## 🚀 Technology Stack

### Frontend Technologies
- **Framework**: Vue 3.5+ (Composition API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0+
- **Routing**: Vue Router 4.5+
- **State Management**: Pinia
- **Build Tool**: Vite
- **UI Components**: Custom Component Library

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/PostgreSQL
- **API Design**: RESTful API
- **Architecture Pattern**: Layered Architecture (API-BIZ-DB)

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Standards**: ESLint + Prettier
- **Type Checking**: TypeScript

## 📦 Quick Start

### ⚠️ Pre-deployment Preparation

#### Environment Check
```bash
# Check Node.js version
node --version  # Should be >= 16.0.0

# Check npm version
npm --version   # Should be >= 8.0.0

# Check database connection
mysql --version  # or psql --version
```

#### Configuration File Setup
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env file, configure database connection and other information

# Frontend configuration (if needed)
cp front/.env.example front/.env
```

### Environment Requirements
- Node.js 16.0+
- npm 8.0+
- MySQL 8.0+ or PostgreSQL 12.0+

### Installation and Running

1. **Clone Project**
```bash
git clone https://github.com/jeasionr-ui/todo.git
cd todo
```

2. **Install Dependencies**
```bash
# Install frontend dependencies
cd front
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure Database**
```bash
# Create database (MySQL example)
mysql -u root -p -e "CREATE DATABASE todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import database structure
mysql -u root -p todo_db < backend/init.sql

# Configure database connection information
# Edit backend/.env file, set correct database connection parameters
```

**⚠️ Database Configuration Notes:**
- Ensure database service is started
- Database user needs permission to create tables and insert data
- Character set recommended to use utf8mb4 to support emoji and special characters
- First run will automatically create necessary table structure

4. **Start Services**
```bash
# Start backend service (port: 3000)
cd backend
npm run dev

# Start frontend development server (port: 5173)
cd ../front
npm run dev
```

**⚠️ Service Startup Notes:**
- Please start backend service first, then frontend service
- Ensure ports 3000 and 5173 are not occupied by other programs
- First startup may take a few minutes to install dependencies
- If startup fails, check Node.js version and dependency installation

5. **Access Application**
- Frontend Application: http://localhost:5173
- Backend API: http://localhost:3000

## 📚 Project Documentation

- [Frontend Development Documentation](./front/README.md) - Vue 3 frontend application development guide
- [Backend Development Documentation](./backend/README.md) - Node.js backend service development guide
- [API Interface Documentation](./backend/README.md#api-说明) - RESTful API interface specification

## 🤝 Contributing

We welcome all forms of contribution, including but not limited to:

- 🐛 Bug reports
- 💡 New feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

### Commit Standards

Please follow the following commit message format:
```
type(scope): description

[optional body]

[optional footer]
```

Type descriptions:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting adjustment
- `refactor`: Refactoring
- `test`: Testing related
- `chore`: Build configuration, etc.

## 📄 License

This project uses a non-commercial license.

### License Overview

**Copyright © 2025 Kim**

- ✅ **Personal Use**: Free use for individuals, educational institutions, non-profit organizations for non-commercial purposes
- ✅ **Modify and Distribute**: Can modify and distribute, but must retain copyright notice and license information
- ✅ **Open Source Requirement**: Modified versions must remain open source and mark modifications
- ❌ **Commercial Use**: Any commercial use requires separate commercial license

### Commercial Authorization

For commercial use (sales, leasing, providing paid services, integration into commercial products, etc.), please contact for commercial authorization:

- 📧 Email: jeasionr@foxmail.com
- 🌐 Project Address: https://github.com/jeasionr-ui/todo

Commercial authorization includes technical support, custom development and other value-added services.

### Disclaimer

This software is provided "as is" without any express or implied warranties. The author is not liable for any damages arising from the use of this software.

For detailed license terms, please see the [LICENSE](./LICENSE) file.

## 🔧 Troubleshooting

### Common Issues

#### Startup Failure
```bash
# Clean dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port occupation
lsof -i :3000  # Check backend port
lsof -i :5173  # Check frontend port
```

#### Database Connection Issues
```bash
# Check database service status
# MySQL
sudo systemctl status mysql
# or brew services list | grep mysql

# PostgreSQL  
sudo systemctl status postgresql
# or brew services list | grep postgresql
```

#### Permission Issues
```bash
# macOS/Linux permission fix
sudo chown -R $(whoami) .
chmod -R 755 .
```

### 🔍 Debug Mode

Enable detailed logs when developing and debugging:
```bash
# Backend debug mode
cd backend
DEBUG=* npm run dev

# Frontend development mode already includes hot reload and error prompts
cd front
npm run dev
```

### 📞 Getting Help

If you encounter problems, you can get help through the following ways:

1. **Check Logs**: Check error information in console output
2. **Search Documentation**: Check project Wiki and README documentation
3. **Submit Issue**: Create detailed issue reports on GitHub
4. **Community Discussion**: Participate in project discussion area exchanges

**When submitting Issues, please include:**
- Operating system and version
- Node.js and npm versions
- Error messages and logs
- Reproduction steps
- Expected behavior

## 📞 Contact Us

- 📧 Email: jeasionr@foxmail.com
- 🌐 Project Homepage: https://github.com/jeasionr-ui/todo
- 📋 Issue Feedback: https://github.com/jeasionr-ui/todo/issues

## 🗺️ Development Roadmap

### Phase 1 ✅
- [x] Core functionality implementation
- [x] User management system
- [x] Basic task management
- [x] Simple reporting functionality

### Phase 2 ✅
- [x] Habit building system
- [x] Goal management functionality
- [x] Pomodoro time management
- [x] Advanced calendar functionality
- [x] Reports and data analysis

### Phase 3 📋
- [ ] Social and collaboration features
- [ ] Advanced reports and data analysis
- [ ] Mobile application
- [ ] Performance optimization and experience enhancement

---

⭐ If this project helps you, please give us a Star!
