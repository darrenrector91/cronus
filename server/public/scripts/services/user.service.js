myApp.service("UserService", ["$http", "$location", "$mdDialog",
    function ($http, $location, $mdDialog) {
        var vm = this;

        vm.userObject = {};
        vm.tableData = {
            list: []
        };
        vm.weekStart = {
            list: []
        };
        vm.getSelectWeek = {
            list: []
        };

        vm.modalData = {};

        vm.getuser = function () {
            return $http.get("/api/user")
                .then(function (response) {
                        if (response.data.username) {
                            vm.userObject.username = response.data.username;
                            vm.userObject.first_name = response.data.first_name;
                            vm.userObject.last_name = response.data.last_name;
                            vm.userObject.job_position = response.data.job_position;
                            vm.getTableData();
                            vm.getStartWeek();
                        } else {
                            $location.path("/home");
                        }
                    },
                    function (response) {
                        $location.path("/home");
                    }
                );
        };

        vm.logout = function () {
            return $http.get("/api/user/logout").then(function (response) {
                vm.getuser();
                $location.path("/home");
            });
        };

        vm.addItem = function (data) {
            return $http
                .post("/api/user/addItem", data)
                .then(function (response) {
                    vm.getTableData();
                    vm.getStartWeek();
                    vm.getuser();
                })
                .catch(function (err) {
                    console.log('error on post request - adding item', err);
                });
        }; //end add item

        vm.getTableData = function () {
            return $http
                .get("/api/user/getTableData").then(function (response) {
                    vm.tableData.list = response.data.rows;
                });
        };

        vm.getStartWeek = function () {
            return $http
                .get("api/user/getWeekStart").then(function (response) {
                    vm.weekStart.list = response.data.rows;
                });
        };

        vm.getStartDate = function (data) {
            return $http
                .get(`/api/user/getSelectWeek/${data}`)
                .then(function (response) {
                    vm.getSelectWeek.list = response.data.rows;
                });
        };

        vm.editTimeEntry = function (id) {
            return $http
                .get(`api/user/editTimeEntry/${id}`)
                .then(function (response) {
                    console.log(response);
                    vm.openEditModal(response);
                });
        };

        vm.openEditModal = function (items, ev) {
            console.log(items);
            $mdDialog.show({
                controller: ModalController,
                controllerAs: "vm",
                //templateUrl: '././views/templates/time-entry-modal.html',
                template: '<md-dialog>' +
                    '<md-content>' +
                    '<table class="table">' +
                    '<thead>' +
                    '<tr>' +
                    '<th> Week Starting </th>' +
                    '<th> Date </th>' +
                    '<th> Time in </th>' +
                    '<th> Breaks(minutes) </th>' +
                    '<th> Time out </th>' +
                    '<th> Edit </th>' +
                    '<th> Delete </th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody ng-repeat = "select in vm.modalData track by $index">' +
                    '<tr>' +
                    '<td> {' +
                    '{' +
                    'select.week_start_date | date: "MM-dd-yyyy"' +
                    '}' +
                    '} </td>' +
                    '<td> {' +
                    '{' +
                    'select.day_of_week | date: "MM-dd-yyyy"' +
                    '}' +
                    '} </td>' +
                    '<td> {' +
                    '{' +
                    'select.time_in | date: "h:mma"' +
                    '}' +
                    '} </td>' +
                    '<td > {' +
                    '{' +
                    'select.break_time' +
                    '}' +
                    '} </td>' +
                    '<td> {' +
                    '{' +
                    'select.time_out | date: "h:mma"' +
                    '}' +
                    '} </td>' +
                    '<td>' +
                    '<button class = "tableEditBtn"' +
                    'ng-click="vm.editTimeEntry(select.timecard_id)">Edit</button>' +
                    '</td>' +
                    '<td>' +
                    '<button class = "tableDeleteBtn"' +
                    'ng-click="vm.deleteItem(select.timecard_id)">Delete</button>' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</md-content>' +
                    '</div>' +
                    '</md-dialog>',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                resolve: {
                    item: function () {
                        return items;
                    }
                }
            });

        };

        function ModalController($mdDialog, item, UserService) {
            const vm = this;
            items = item.data;
            vm.modalData = items.rows;

            self.closeModal = function () {
                self.hide();
            };
        }

        vm.deleteItem = function (id) {
            return $http
                .delete(`/api/user/deleteItem/${id}`)
                .then(function (response) {
                    vm.getStartDate();
                    vm.getuser();
                })
                .catch(function (error) {
                    console.log('deleteItem error', error);
                });
        }
    }
]);