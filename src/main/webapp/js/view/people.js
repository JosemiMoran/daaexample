var PeopleView = (function() {

	var dao;
	// Referencia a this que permite acceder a las funciones públicas desde las funciones de jQuery.
	var self;
	
	var formId = 'people-form';
	var listId = 'people-list';
	var formQuery = '#' + formId;
	var listQuery = '#' + listId;

	
	function PeopleView(peopleDao, formContainerId, listContainerId) {
		dao = peopleDao;
		self = this;
		
		insertPeopleForm($('#' + formContainerId));
		insertPeopleList($('#' + listContainerId));
		
		this.init = function() {
			daoList = dao.listPeople;
			dao.listPeople(function(people) {
				$.each(people, function(key, person) {
					appendToTable(person);
				});
			},
			function() {
			    	alert('No has sido posible acceder al listado de personas.');
			});
			
			// La acción por defecto de enviar formulario (submit) se sobreescribe
			// para que el envío sea a través de AJAX
			$(formQuery).submit(function(event) {
				var person = self.getPersonInForm();
				
				if (self.isEditing()) {
					dao.modifyPerson(person,
						function(person) {
							$('#person-' + person.id + ' td.name').text(person.name);
							$('#person-' + person.id + ' td.surname').text(person.surname);
							self.resetForm();
						},
						showErrorMessage,
						self.enableForm
					);
				} else {
					dao.addPerson(person,
						function(person) {
							appendToTable(person);
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

		this.getPersonInForm = function() {
			var form = $(formQuery);
			return {
				'id': form.find('input[name="id"]').val(),
				'name': form.find('input[name="name"]').val(),
				'surname': form.find('input[name="surname"]').val()
			};
		};

		this.getPersonInRow = function(id) {
			var row = $('#person-' + id);

			if (row !== undefined) {
				return {
					'id': id,
					'name': row.find('td.name').text(),
					'surname': row.find('td.surname').text()
				};
			} else {
				return undefined;
			}
		};
		
		this.editPerson = function(id) {
			var row = $('#person-' + id);

			if (row !== undefined) {
				var form = $(formQuery);
				
				form.find('input[name="id"]').val(id);
				form.find('input[name="name"]').val(row.find('td.name').text());
				form.find('input[name="surname"]').val(row.find('td.surname').text());
				
				$('input#btnSubmit').val('Modificar');
			}
		};
		
		this.deletePerson = function(id) {
			if (confirm('Está a punto de eliminar a una persona. ¿Está seguro de que desea continuar?')) {
				dao.deletePerson(id,
					function() {
						$('tr#person-' + id).remove();
					},
					showErrorMessage
				);
			}
		};

		this.isEditing = function() {
			return $(formQuery + ' input[name="id"]').val() != "";
		};

		this.disableForm = function() {
			$(formQuery + ' input').prop('disabled', true);
		};

		this.enableForm = function() {
			$(formQuery + ' input').prop('disabled', false);
		};

		this.resetForm = function() {
			$(formQuery)[0].reset();
			$(formQuery + ' input[name="id"]').val('');
			$('#btnSubmit').val('Crear');
		};
	};
	
	var insertPeopleList = function(parent) {
		parent.append(
			'<table id="' + listId + '" class="table">\
				<thead>\
					<tr class="row">\
						<th onclick="sortTable(0)" class="col-sm-3">Nombre</th>\
						<th onclick="sortTable(1)" class="col-sm-4">Apellido</th>\
						<th onclick="sortTable(2)" class="col-sm-2">&nbsp;</th>\
						<th onclick="sortTable(3)" class="col-sm-3"><a id="petsView" class="petsView btn btn-primary" href="">Ver mascotas</a>\</th>\
					</tr>\
				</thead>\
				<tbody>\
				</tbody>\
			</table>'
		);
	};

	var insertPeopleForm = function(parent) {
		parent.append(
			'<form id="' + formId + '" class="mb-5 mb-10">\
				<input name="id" type="hidden" value=""/>\
				<div class="row">\
					<div class="col-sm-4">\
						<input name="name" type="text" value="" placeholder="Nombre" class="form-control" required/>\
					</div>\
					<div class="col-sm-5">\
						<input name="surname" type="text" value="" placeholder="Apellido" class="form-control" required/>\
					</div>\
					<div class="col-sm-3">\
						<input id="btnSubmit" type="submit" value="Crear" class="btn btn-success" />\
						<input id="btnClear" type="reset" value="Limpiar" class="btn" />\
					</div>\
				</div>\
			</form>'
		);
	};

	var createPersonRow = function(person) {
		return '<tr id="person-'+ person.id +'" class="row">\
			<td class="name col-sm-3">' + person.name + '</td>\
			<td class="surname col-sm-4">' + person.surname + '</td>\
			<td class="col-sm-2">\
				<a class="edit btn btn-warning" href="#">Editar</a>\
				<a class="delete btn btn-danger" href="#">Eliminar</a>\
			</td>\
			\<td class="empty col-sm-3">&nbsp;</td>\
		</tr>';
	};

	var showErrorMessage = function(jqxhr, textStatus, error) {
		alert(textStatus + ": " + error);
	};

	var addRowListeners = function(person) {
		$('#person-' + person.id + ' a.edit').click(function() {
			self.editPerson(person.id);
		});
		
		$('#person-' + person.id + ' a.delete').click(function() {
			self.deletePerson(person.id);
		});
	};

	var appendToTable = function(person) {
		$(listQuery + ' > tbody:last')
			.append(createPersonRow(person));
		addRowListeners(person);
	};
	
	return PeopleView;
})();

function goPets(){
	$.ajax({
		url: 'rest/pets',
		type: 'GET',
	});
	window.location = 'pets.html';
}

function sortTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("people-list");
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

