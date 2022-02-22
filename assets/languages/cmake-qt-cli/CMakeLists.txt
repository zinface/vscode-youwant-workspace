
cmake_minimum_required(VERSION 3.5.1)

project(template LANGUAGES CXX VERSION 0.0.1)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt5 COMPONENTS Core Network)

# 头文件目录
include_directories()

add_executable(${PROJECT_NAME} 
    "main.cpp"
)
target_link_libraries(${PROJECT_NAME} Qt5::Core Qt5::Network)

