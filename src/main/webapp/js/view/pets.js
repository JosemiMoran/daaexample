var PetsView = (function () {
    var dao;
    var pDao = new PeopleDAO();
    // Referencia a this que permite acceder a las funciones públicas desde las funciones de jQuery.
    var self;

    var formId = 'pets-form';
    var listId = 'pets-list';
    var formQuery = '#' + formId;
    var listQuery = '#' + listId;
    let personArray = [];


    function PetsView(petsDao, formContainerId, listContainerId) {
        dao = petsDao;
        self = this;

        pDao.listPeople(function (people) {
            $.each(people, function (key, person) {
                personArray.push(person);
            })
        }, function () {
            alert('No has sido posible acceder al listado de mascotas.');
        });

        console.log(personArray);


        insertPetsForm($('#' + formContainerId));
        insertPetsList($('#' + listContainerId));

        this.init = function () {
            dao.listPets(function (pets) {
                    $.each(pets, function (key, pet) {
                        let ownerName = " ";
                        let all = personArray.filter(person => person.id === pet.ownerId);
                        ownerName = all[0].name + " " + all[0].surname;
                        appendToTable(pet, ownerName);
                    });
                },
                function () {
                    alert('No has sido posible acceder al listado de mascotas.');
                });

            // La acción por defecto de enviar formulario (submit) se sobreescribe
            // para que el envío sea a través de AJAX
            $(formQuery).submit(function (event) {
                var pet = self.getPetInForm();

                if (self.isEditing()) {
                    dao.modifyPet(pet,
                        function (pet) {
                            let ownerName = " ";
                            let all = personArray.filter(person => person.id === pet.ownerId);
                            ownerName = all[0].name + " " + all[0].surname;
                            $('#pet-' + pet.petId + ' td.name').text(pet.name);
                            $('#pet-' + pet.petId + ' td.type').text(pet.type);
                            $('#pet-' + pet.petId + ' td.ownerId').text(pet.ownerId);
                            self.resetForm();
                        },
                        showErrorMessage,
                        self.enableForm
                    );
                } else {
                    dao.addPet(pet,
                        function (pet) {
                            let all = personArray.filter(person => person.id === pet.ownerId);
                            let ownerName = all[0].name + " " + all[0].surname;
                            console.log(ownerName);
                            appendToTable(pet, ownerName);
                            self.resetForm();
                        },
                        showErrorMessage,
                        self.enableForm
                    );
                }

                return false;
            });

            $('#btnClear').click(this.resetForm);
        };

        this.getPetInForm = function () {
            var form = $(formQuery);
            return {
                'id': form.find('input[name="id"]').val(),
                'name': form.find('input[name="name"]').val(),
                'type': form.find('input[name="type"]').val(),
                'ownerId': form.find('input[name="ownerId"]').val()
            };
        };

        this.getPetInRow = function (id) {
            var row = $('#pet-' + id);

            if (row !== undefined) {
                return {
                    'petId': id,
                    'name': row.find('td.name').text(),
                    'type': row.find('td.type').text(),
                    'ownerId': row.find('td.ownerId').text(),
                };
            } else {
                return undefined;
            }
        };

        this.editPet = function (id) {
            var row = $('#pet-' + id);

            if (row !== undefined) {
                var form = $(formQuery);

                form.find('input[name="id"]').val(id);
                form.find('input[name="name"]').val(row.find('td.name').text());
                form.find('input[name="type"]').val(row.find('td.type').text());
                form.find('input[name="ownerId"]').val(row.find('td.ownerId').text());

                $('input#btnSubmit').val('Modificar');
            }
        };

        this.deletePet = function (id) {
            if (confirm('Está a punto de eliminar a una mascota. ¿Está seguro de que desea continuar?')) {
                dao.deletePet(id,
                    function () {
                        $('tr#pet-' + id).remove();
                    },
                    showErrorMessage
                );
            }
        };

        this.isEditing = function () {
            return $(formQuery + ' input[name="id"]').val() !== "";
        };

        this.disableForm = function () {
            $(formQuery + ' input').prop('disabled', true);
        };

        this.enableForm = function () {
            $(formQuery + ' input').prop('disabled', false);
        };

        this.resetForm = function () {
            $(formQuery)[0].reset();
            $(formQuery + ' input[name="id"]').val('');
            $('#btnSubmit').val('Crear');
        };
    }

    var insertPetsList = function (parent) {
        parent.append(
            '<table id="' + listId + '" class="table">\
				<thead>\
					<tr class="row">\
						<th onclick="sortTable(0)" class="col-sm-3">Nombre</th>\
						<th onclick="sortTable(1)" class="col-sm-4">Tipo</th>\
						<th onclick="sortTable(2)" class="col-sm-3">Dueño</th>\
						<th onclick="sortTable(3)" class="col-sm-2">&nbsp;</th>\
					</tr>\
				</thead>\
				<tbody>\
				</tbody>\
			</table>'
        );
    };

    var insertPetsForm = function (parent) {
        parent.append(
            '<form id="' + formId + '" class="mb-5 mb-10">\
				<input name="id" type="hidden" value=""/>\
				<div class="row">\
					<div class="col-sm-3">\
						<input name="name" type="text" value="" placeholder="Nombre" class="form-control" required/>\
					</div>\
					<div class="col-sm-4">\
						<input name="type" type="text" value="" placeholder="Tipo" class="form-control" required/>\
					</div>\
					\<div class="col-sm-3">\
						<input id="ownerId" name="ownerId" type="text" placeholder="Id del dueño" class="form-control" required/>\
					</div>\
					<div class="col-sm-2">\
						<input id="btnSubmit" type="submit" value="Crear" class="btn btn-success" />\
						<input id="btnClear" type="reset" value="Limpiar" class="btn" />\
					</div>\
				</div>\
			</form>'
        );
    };

    var createPetRow = function (pet, ownerName) {
        return '<tr id="pet-' + pet.petId + '" class="row">\
			<td class="name col-sm-3">' + pet.name + '</td>\
			<td class="type col-sm-4">' + pet.type + '</td>\
			\<td class="ownerId col-sm-3">' + ownerName + '</td>\
			<td class="col-sm-2">\
				<a class="edit btn btn-warning" href="#">Editar</a>\
				<a class="delete btn btn-danger" href="#">Eliminar</a>\
			</td>\
		</tr>';
    };

    var showErrorMessage = function (jqxhr, textStatus, error) {
        alert(textStatus + ": " + error);
    };

    var addRowListeners = function (pet) {
        $('#pet-' + pet.petId + ' a.edit').click(function () {
            self.editPet(pet.petId);
        });

        $('#pet-' + pet.petId + ' a.delete').click(function () {
            self.deletePet(pet.petId);
        });
    };


    var appendToTable = function (pet, ownerName) {
        $(listQuery + ' > tbody:last')
            .append(createPetRow(pet, ownerName));
        addRowListeners(pet);
    };


    return PetsView;
})();

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("pets-list");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


