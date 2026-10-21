# File Storage

A file storage web application that allows users to upload, organize, manage, preview, and share their files with other users through their email addresses.

File Storage uses **Next.js** to build the application and **Appwrite** to handle authentication, database operations, and file storage. Users can view and download files, search and sort their files, monitor their storage usage, and share files with other users.

![File Storage Dashboard](./screenshots/dashboard_screenshot.png)

### 🚀 Live Demo

You can view the project here: **[View File Storage](https://file-storage-49mc.onrender.com)**

## ✨ Features

- Create an account and sign in using email OTP verification
- Upload files up to 50 MB
- Files are grouped into categories: documents, images, videos, audio, and other
- Preview files by clicking on them
- Search for files by name
- Sort files
- Rename files
- View file details
- Share files with other users via their email addresses
- Download files
- Delete files
- View storage usage for individual file categories and overall storage
- Sign out
- Cookie-based authentication
- Responsive UI
- Error handling for authentication and account-related issues

## ⭐ Features I Added Independently

Although I followed a tutorial as a starting point for this project, I implemented my own dashboard design and made several changes to the original implementation. I also updated all parts of the project to use the latest tooling and configurations.

### UI & Styling

- Designed my own dashboard UI/UX instead of copying the tutorial's dashboard design
- Used Lucide React for icons throughout the application

### Authentication & Account Creation

- Updated the account creation flow so that a user is only added to the users table after successfully verifying their email OTP
- Fixed an issue where accounts could be created before OTP verification was completed
- Added error messages when OTP verification fails
- Added error handling for sign-in attempts when an account cannot be found
- Added error handling when someone attempts to create an account that already exists

### Development & Configuration

- Used the latest version of Next.js for the project
- Updated ESLint to use the flat configuration format instead of the older `extends`-based configuration
- Updated the Appwrite implementation to use newer SDK syntax and configuration

## 🛠️ Technologies & Tools

### Frontend

- **Next.js 16** — React framework for building the application
- **React 19** — UI rendering and component-based development
- **TypeScript** — Type safety during development
- **Tailwind CSS 4** — Styling and responsive layouts
- **shadcn/ui** — UI components
- **Base UI** — Accessible UI primitives
- **Lucide React** — Icons
- **React Dropzone** — File upload interactions
- **React Hook Form** — Form management
- **Zod** — Schema validation
- **use-debounce** — Debounced input handling

### Backend & Services

- **Appwrite** — Authentication, database operations, and file storage

### Development Tools

- **ESLint 9** — Code linting using the flat configuration format
- **Prettier** — Code formatting

## 💻 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project and add your environment variables required by the Appwrite configuration.

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_DATABASE=
NEXT_PUBLIC_APPWRITE_USERS=
NEXT_PUBLIC_APPWRITE_FILES=
NEXT_PUBLIC_APPWRITE_BUCKET=
NEXT_APPWRITE_KEY=
```

### 4. Start the development server

```bash
npm run dev
```

The application will then be available at https://localhost:3000.

## 📚 Project Background

I built this project because I was curious about how file storage applications work and wanted to gain more experience building one myself.

I was particularly interested in learning how file uploads and storage buckets would be implemented in practice, as well as file sharing between users. This project also gave me an opportunity to practice Next.js and work more with Appwrite's authentication, database, and storage features. I also gained experience working with email OTP verification, cookie-based authentication, and file categorization.

## 🔮 Future Improvements

There are several features I think could improve this project if I continued to expand it in the future:

- Improve the mobile UI and overall mobile experience
- Add the ability to delete multiple files at once
- Add the ability to download multiple files at once
- Introduce additional account settings
- Notify users when a file is shared with them
- Add a Shared with Me tab to display files shared by other users

## 📸 Screenshots

### Dashboard

![File Storage Dashboard](./screenshots/dashboard_screenshot.png)

### File Preview

![File Preview](./screenshots/file_preview_screenshot.png)

### File Sharing

![File Sharing](./screenshots/file_sharing_screenshot.png)
