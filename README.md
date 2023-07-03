<a name="readme-top"></a>

# Task Tracker


This is a simple task tracker app created for educational purposes.
* To create the client part of the application, the Vue.js framework (v3) and the Vuetify, Vuex, Vue Router libraries were used.
* The project implemented a Gantt chart component using JavaScript, the Chart.js library, and the [vue-chartjs](https://vue-chartjs.org/) wrapper.
* To create the server part of the application, [CMS Drupal](https://www.drupal.org/) (9) was used with an additional module connected to implement the JSON API specification.



## Built With

* [![Vite][Vite.js]][Vite-url]
* [![Vue][Vue.js]][Vue-url]
* [![Vuex][Vuex.js]][Vuex-url]
* [![Vuetify][Vuetify.js]][Vuetify-url]
* [![Chart.js][Chart.js]][Chartjs-url]
* [![Axios][axios.com]][axios-url]
* [![Vitest][Vitest.js]][Vitest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

The project has the ability to create, modify and delete tasks, projects and teams.

![Application main page](https://drive.google.com/uc?export=view&id=1dbQ5c7ZAdbICKl4AycIyaJcvt8Sp6his)

The Incoming Tasks page displays the tasks assigned to the user, broken down by deadline time. It is possible to filter tasks by projects. On this page, the user can add an answer to a task.

![Incoming tasks page](https://drive.google.com/uc?export=view&id=1gQuNxwqEb-j9613YElLpNj_w_m4jR4qF)

The project page has several basic options for presenting tasks.
A task table component was created with the ability to sort by the selected field and search for a task by name.

![Task table](https://drive.google.com/uc?export=view&id=1KEO3sWOTkD43vcYvgjOKiQiPVNdY__-f)

To control the process of completing tasks, a Gantt chart has been implemented with the ability to change the display by time interval, and with filtering by executor.

![Gantt chart](https://drive.google.com/uc?export=view&id=1eg41o95o69qOjpLv8NJWmlkEkPE7SM8l)

In addition, this component has the ability to edit tasks and display a notification if they overlap.

![Gantt chart with tasks edit](https://drive.google.com/uc?export=view&id=1C_CXKr_CI6ehy8mIoLwJaIJDsJwRhEHu)

![Gantt chart with tasks edit(gif)](https://github.com/Evgen-kun/task-tracker/assets/91155525/c7c1b393-83fd-491b-9e45-8fe6de92be1b)

A Kanban board component has been developed with the ability to drag and drop tasks ([vue.draggable.next](https://sortablejs.github.io/vue.draggable.next)) across columns to change their status. In accordance with the kanban methodology, it is possible to set a limit on the number of tasks with the status “In progress”.

![Kanban board](https://drive.google.com/uc?export=view&id=1a2U5yorTZonZM577miY-7eXUhrsW3f19)

A component has been created to display some information about the tasks in the project, for example, the number of overdue tasks and the workload of the team in the project.

![Project dashboard](https://drive.google.com/uc?export=view&id=1uM1GhExQ6yzPsOA5FToWSYoXXgiaVMxN)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Vite.js]: https://img.shields.io/badge/Vite-9933FF?style=for-the-badge&logo=vite&logoColor=FFFF00
[Vite-url]: https://vitejs.dev/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Vuex.js]: https://img.shields.io/badge/Vuex-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vuex-url]: https://vuex.vuejs.org/
[Vuetify.js]: https://img.shields.io/badge/Vuetify-0078D4?style=for-the-badge&logo=vuetify&logoColor=white
[Vuetify-url]: https://vuetifyjs.com/
[Chart.js]: https://img.shields.io/badge/Chart.js-white?style=for-the-badge&logo=chartdotjs&logoColor=FF77BC
[Chartjs-url]: https://www.chartjs.org/
[axios.com]: https://img.shields.io/badge/axios-9933FF?style=for-the-badge&logo=axios&logoColor=white
[axios-url]: https://axios-http.com/
[Vitest.js]: https://img.shields.io/badge/Vitest-4C9900?style=for-the-badge&logo=vitest&logoColor=FFFF00
[Vitest-url]: https://vitest.dev/
