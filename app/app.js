var meuApp = angular.module('meuApp', []);

meuApp.component('headerComponent', {
    templateUrl: 'components/header.html'
});

meuApp.component('footerComponent', {
    templateUrl: 'components/footer.html'
});

meuApp.component('modalComponent', {
     templateUrl: 'components/modal.html'
 });

meuApp.run(function ($rootScope) {
    // Inicialize a lista de usuários a partir do Local Storage
    var usuariosLocalStorage = localStorage.getItem('usuarios');
    $rootScope.usuarios = usuariosLocalStorage ? JSON.parse(usuariosLocalStorage) : [];
});
