const testData = [
	['Garage1', 'Ho Chi Minh', 4.7, true],
	['Garage2', 'Ho Chi Minh', 3.7, false],
	['Garage3', 'Ho Chi Minh', 1.7, false],
	['Garage4', 'Ho Chi Minh', 2, false],
	['Garage5', 'Ho Chi Minh', 3.3, false],
	['Garage6', 'Ho Chi Minh', 4.4, false],
	['Garage7', 'Ha Noi', 5, true],
	['Garage8', 'Ha Noi', 1, true],
	['Garage9', 'Ha Noi', 2, true],
	['Garage10', 'Ha Noi', 4.7, true]
]

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

// Parsing mustache templates before-hand
const actionButtonTemplate = $('#actionButtonTemplate').html();
Mustache.parse(actionButtonTemplate);

$(document).ready(function() {
	let oTable = $('#garages').DataTable({
		data: testData,
		columnDefs: [
			{
				// Render stars
				targets: 2,
				render: function(data, type) {
					if(type === 'display'){
						for(var html = '', star = data, i = 0; i < 5; i++) {
							if(star >= 1) {
								html += fullStar;
								star--;
							} else if (star > 0) {
								html += halfStar;
								star--;
							} else {
								html += emptyStar;
							}
						}
						return html += `&nbsp;&nbsp;<span class="badge">${data}</span>`;
					}
					return data;
				}
			},
			{
				// Render status label
				targets: 3,
				render: function(data, type) {
					if(type === 'display'){
						if(data){
							return '<div class="status-label" ><p class="label label-primary">Active</p></div>';
						} else {
							return '<div class="status-label" ><p class="label label-danger" >Inactive</p></div>';
						}
					}
					return data;
				}
			},
			{
				// Render action button
				targets: 4,
				render: function(data, type, row) {
					return Mustache.render(actionButtonTemplate);
				}
			}
		],
		columns: [
			{ title: 'Name', width: '55%' },
			{ title: 'Province', width: '15%' },
			{ title: 'Stars', width: '10%' },
			{ title: 'Status', width: '10%'},
			{
				title: 'Action',
				width: '10%'
			}
		]
	});
});