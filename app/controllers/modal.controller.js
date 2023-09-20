meuApp.controller('MeuController', function ($scope) {
    $scope.showModal = false;
    $scope.mostrarMensagemSucesso = false; // Inicialmente, a mensagem não é exibida

    // Função para mostrar o modal
    $scope.mostrarModal = function () {
        // alert('A função mostrarModal() foi chamada');
        $scope.showModal = true;
        console.log($scope.showModal); // Verifique o valor no console
        // alert('showModal definido como true');
    };

    // Função para fechar o modal
    $scope.fecharModal = function () {
        $scope.showModal = false;
        $scope.mostrarFilhosCadastro = false;
        $scope.perfilName = '';
        $scope.hierarquia = {};
    };

    // Função de inicialização
    $scope.init = function () {
        // Seu código de inicialização aqui
    };

    $scope.adicionarUsuario = function () {

        if (!$scope.perfilName) {
            // Exibir um alerta ou mensagem informando que o campo "Perfil" é obrigatório
            alert('O campo "Perfil" é obrigatório');
            return; // Sair da função sem adicionar o usuário
        }

        var peloMenosUmCheckboxMarcado = false;
        angular.forEach($scope.hierarquia, function (value) {
            if (value) {
                peloMenosUmCheckboxMarcado = true;
            }
        });

        if (!peloMenosUmCheckboxMarcado) {
            // Exiba um alerta informando que pelo menos uma funcionalidade deve ser marcada
            alert('Marque pelo menos uma funcionalidade.');
            return; // Saia da função
        }

        // Verifique se a funcionalidade já existe na lista de usuários
        var funcionalidadeExistente = $scope.usuarios.some(function (usuario) {
            return usuario.perfil === $scope.perfilName;
        });


        if (funcionalidadeExistente) {
            // Exiba um alerta informando que a funcionalidade já está cadastrada
            alert('A funcionalidade já está cadastrada para esse perfil!');
            // Limpe o formulário
            $scope.perfilName = '';
            $scope.hierarquia = {};
        } else {
            // Crie um objeto de usuário com os dados do formulário
            var novoUsuario = {
                perfil: $scope.perfilName,
                hierarquia: {}
            };

            // Capture os valores marcados nos checkboxes de hierarquia
            angular.forEach($scope.hierarquia, function (value, key) {
                if (value) {
                    novoUsuario.hierarquia[key] = true;
                }
            });

            // Adicione o novo usuário à lista
            $scope.usuarios.push(novoUsuario);

            // Limpe o formulário
            $scope.perfilName = '';
            $scope.hierarquia = {};

            // Atualize os dados no Local Storage
            localStorage.setItem('usuarios', JSON.stringify($scope.usuarios));

            alert('Cadastro realizado com sucesso!');
            console.log($scope.usuarios);

            $scope.mostrarFilhosCadastro = false;
            $scope.showModal = false;
        }
    };

    $scope.deletarUsuario = function (usuario) {
        var index = $scope.usuarios.indexOf(usuario);
        if (index !== -1) {
            $scope.usuarios.splice(index, 1);
            // Atualize os dados no Local Storage após a exclusão
            localStorage.setItem('usuarios', JSON.stringify($scope.usuarios));

            alert('Exclusão realizada com sucesso!');
            console.log($scope.usuarios);
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        var checkboxes = document.querySelectorAll("#hierarquia input[type='checkbox']");

        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function () {
                var isChecked = this.checked;

                // Marcar/desmarcar todos os filhos quando o pai é marcado/desmarcado
                if (this.classList.contains("pai")) {
                    var ul = this.parentElement.nextElementSibling;
                    var filhos = ul.querySelectorAll("input[type='checkbox'].filho");

                    filhos.forEach(function (filho) {
                        filho.checked = isChecked;
                    });
                }

                // Marcar/desmarcar o pai quando todos os filhos estão marcados/desmarcados
                if (this.classList.contains("filho")) {
                    var ul = this.closest("ul");
                    var pais = ul.previousElementSibling.querySelector("input[type='checkbox'].pai");

                    var todosFilhosMarcados = Array.from(ul.querySelectorAll("input[type='checkbox'].filho"))
                        .every(function (filho) {
                            return filho.checked;
                        });

                    pais.checked = todosFilhosMarcados;
                }
            });
        });
    });

    $scope.mostrarFilhosCadastro = false;
    // Defina variáveis para os outros pais, se necessário


    $scope.toggleMostrarFilhos = function (pai) {
        if (pai === 'Cadastro') {
            $scope.mostrarFilhosCadastro = !$scope.mostrarFilhosCadastro;
        }
        // Adicione casos para os outros pais, se necessário
    };


    $scope.marcarDesmarcarFilhos = function (pai) {

        var filhos = ['Funcionario', 'Produtos', 'Usuario', 'Perfil'];
        if ($scope.hierarquia[pai]) {
            // Se o checkbox "pai" estiver marcado, marque todos os checkboxes "filho"
            angular.forEach(filhos, function (filho) {
                $scope.hierarquia[filho] = true;
            });
        } else {
            // Se o checkbox "pai" estiver desmarcado, desmarque todos os checkboxes "filho"
            angular.forEach(filhos, function (filho) {
                $scope.hierarquia[filho] = false;
            });
        }
    };

    $scope.editando = false;
    // Variável para armazenar o índice do usuário a ser editado
    var indiceUsuarioParaEditar = -1;

    // Função para abrir o modal em modo de edição
    $scope.editarUsuario = function (usuario, index) {
        // Preencha os campos do modal com os dados do usuário
        $scope.mostrarFilhosCadastro = true;
        $scope.editando = true;
        $scope.perfilNameDisabled = true;
        $scope.perfilName = usuario.perfil;
        $scope.hierarquia = angular.copy(usuario.hierarquia);

        // Guarde o índice do usuário a ser editado
        indiceUsuarioParaEditar = index;

        // Abra o modal
        $scope.mostrarModal();
    };

    // Função para salvar a edição do usuário
    $scope.salvarEdicao = function () {
        if (indiceUsuarioParaEditar !== -1) {
           
            var peloMenosUmMarcado = false;
            angular.forEach($scope.hierarquia, function (valor, chave) {
                if (chave !== 'Cadastro' && valor === true) {
                    peloMenosUmMarcado = true;
                }
            });

            if (!peloMenosUmMarcado) {
                // Exiba uma mensagem ou faça o que for necessário para lidar com a falta de checkboxes marcados
                alert('Selecione pelo menos uma funcionalidade!');
                return;
            }

             // Atualize os dados do usuário no array de usuários
             $scope.usuarios[indiceUsuarioParaEditar].perfil = $scope.perfilName;
             $scope.usuarios[indiceUsuarioParaEditar].hierarquia = angular.copy($scope.hierarquia);

            // Limpe os campos do modal
            $scope.perfilName = '';
            $scope.hierarquia = {};

            // Feche o modal
            $scope.fecharModal();

            // Limpe o índice do usuário a ser editado
            indiceUsuarioParaEditar = -1;

            $scope.editando = false;
            $scope.mostrarFilhosCadastro = false;
            $scope.perfilNameDisabled = false;
            
            // Atualize os dados no 'localStorage'
            localStorage.setItem('usuarios', JSON.stringify($scope.usuarios));

            alert('Edição realizada com sucesso!');
            console.log($scope.usuarios);
        }
    };

});
