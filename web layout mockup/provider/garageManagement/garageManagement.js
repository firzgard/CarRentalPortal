const testData = [
	['Garage1', 4.7, true],
	['Garage2', 3.7, false],
	['Garage3', 1.7, false],
	['Garage4', 2, false],
	['Garage5', 3.3, false],
	['Garage6', 4.4, false],
	['Garage7', 5, true],
	['Garage8', 1, true],
	['Garage9', 2, true],
	['Garage10', 4.7, true]
]

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>'

$(document).ready(function() {
	let oTable = $('#garages').DataTable({
		data: testData,
		columnDefs: [
			{
				// Render stars
				targets: 1,
				render: function(data, type) {
					if(type === 'display'){
						for(var html = '', i = 0; i < 5; i++) {
							if(data >= 1) {
								html += fullStar;
								data--;
							} else if (data > 0) {
								html += halfStar;
								data--
							} else {
								html += emptyStar;
							}
						}
						return html
					}
					return data;
				}
			},
			{
				// Render status label
				targets: 2,
				render: function(data, type) {
					if(type === 'display'){
						if(data){
							return '<div class="label label-primary" >Active</div>';
						} else {
							return '<div class="label label-danger" >Inactive</div>';
						}
					}
					return data
				}
			}
		],
		columns: [
			{ title: 'Name', width: '70%' },
			{ title: 'Stars', width: '10%' },
			{ title: 'Status', width: '10%'},
			{
				title: 'Action',
				width: '10%',
				defaultContent: `<div class="btn-group" >
					<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
						<i class="fa fa-gear"></i> Actions <i class="caret"></i>
					</button>
					<ul class="dropdown-menu">
						<li><a href="#">Edit</a></li>
						<li><a href="#">Deactive</a></li>
						<li><a href="#">Delete</a></li>
					</ul>
				</div>`
			}
		]
	});
});