define([
    'angular',
    './baseList'
], function(angular, BaseListController) {
    'use strict';

    ArchiveListController.$inject = ['$scope', '$injector', 'superdesk', 'session', 'api', 'ViewsCtrl', 'ContentCtrl'];
    function ArchiveListController($scope, $injector, superdesk, session, api, ViewsCtrl, ContentCtrl) {

        var resource;

        $injector.invoke(BaseListController, this, {$scope: $scope});

        $scope.createdMedia = {
            items: []
        };

        $scope.currentModule = 'archive';
        $scope.views = new ViewsCtrl($scope);
        $scope.content = new ContentCtrl($scope);
        $scope.type = 'archive';

        $scope.openUpload = function() {
            superdesk.intent('upload', 'media').then(function(items) {
                // todo: put somewhere else
                $scope.createdMedia.items.unshift.apply($scope.createdMedia.items, items);
            });
        };

        this.fetchItems = function(criteria) {
            if (resource == null) {
                return;
            }

            resource.query(criteria).then(function(items) {
                $scope.items = items;
                $scope.createdMedia = {
                    items: []
                };
            });
        };

        $scope.$on('changes in media_archive', this.refresh);

        $scope.$watch('selectedDesk', angular.bind(this, function(desk) {
            resource = desk ? api('archive') : api('content', session.identity);
            this.refresh();
        }));
    }

    return ArchiveListController;
});
