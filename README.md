# TaskMan

## Project Description
### 1.1 Project

TaskMan

### 1.2 Description

This project aims to develop a cloud-based task management application that enables users to efficiently create, organize, and track their tasks. The application will support important task features to enhance productivity. Users will have access to their tasks from anywhere through a web interface.

## Overview
### 2.1 Purpose

The purpose of this project is to provide individuals and teams with a simple and scalable task management solution that integrates cloud storage, real-time updates, and notification services while also demonstrating AWS skills.

##2.2 Scope

The system will allow users to create, update, and delete. The project will be deployed on AWS to ensure scalability and availability.

### 2.3.1 Functional Requirements

Users can create, edit, and delete tasks.


Tasks can be marked down as completed

Entire task groups can be deleted

### 2.3.2 Non-Functional Requirements

The system should handle concurrent users and their tasks concurrently

99.9% uptime reliability.

Secure authentication and encrypted data storage.

### 2.3.3 Technical Requirements

Hosted on AWS (EC2, S3, RDS).

Built with JavaScript, Node.js, and Express.js.

## System Architecture

### 3.1 Overview

The system will follow a client-server architecture with a simple frontend, a Node.js backend using Express.js, and a PostgreSQL database hosted on AWS RDS.

## Data Design

### 5.1 Persistent/Static Data

The database will consist of tables for tasks, and task groups. A relational structure will be used to maintain data integrity.

## User Interface Design

### 6.1 User Interface Overview

The application will feature a dashboard where users can view, add, and manage tasks. Each task will display relevant details such as status and description.

### 6.2 User Interface Navigation Flow

Main Screen → 2. Dashboard Tasks

### 6.3 Use Cases / User Function Description

A user enters task group key and views their task dashboard.

The user adds a new task

Tasks are deleted or marked as complete.

