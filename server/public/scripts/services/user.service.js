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

        vm.showAdvanced = function (id) {
            return $http
                .get(`api/user/editTimeEntry/${id}`)
                .then(function (response) {
                    console.log(response);

                    //vm.openEditModal(response);
                });
        };

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