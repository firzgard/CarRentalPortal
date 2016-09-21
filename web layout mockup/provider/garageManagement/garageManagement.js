const testData = [
	[1, 'Garage1', 'Ho Chi Minh', 4.7, true],
	[2, 'Garage2', 'Ho Chi Minh', 3.7, false],
	[3, 'Garage3', 'Ho Chi Minh', 1.7, false],
	[4, 'Garage4', 'Ho Chi Minh', 2, false],
	[5, 'Garage5', 'Ho Chi Minh', 3.3, false],
	[6, 'Garage6', 'Ho Chi Minh', 4.4, false],
	[7, 'Garage7', 'Ha Noi', 5, true],
	[8, 'Garage8', 'Ha Noi', 1, true],
	[9, 'Garage9', 'Ha Noi', 2, true],
	[10, 'Garage10', 'Ha Noi', 4.7, true]
]

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

// Parsing mustache templates before-hand
const	actionButtonTemplate = $('#actionButtonTemplate').html(),
		garageEditorTemplate = $('#garageEditorTemplate').html();
Mustache.parse(actionButtonTemplate);
Mustache.parse(garageEditorTemplate);

$(document).ready(function() {
	// Render table
	$('#garages').DataTable({
		data: testData,
		columnDefs: [
			{
				// Render stars
				targets: 3,
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
				targets: 4,
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
				targets: 5,
				render: function(data, type, row) {
					return Mustache.render(actionButtonTemplate, {garageID: row[0], isActive: row[4]});
				}
			}
		],
		columns: [
			{ visible: false },
			{ title: 'Name', width: '55%' },
			{ title: 'Province', width: '15%' },
			{ title: 'Stars', width: '10%' },
			{ title: 'Status', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});

	// Render garageEditor modal on clicking edit button
	$('#garageEditor').on('show.bs.modal', function(event) {
		// Get the data-garage-id attribute from button
		let id = $(event.relatedTarget).data('garage-id');

		// fking ajax here. Get the bloody data and throw it into mustache to render the modal's content
		// for now, use mockup data
		let openTime = new Date(2000, 1, 1, 6, 0, 0),
			closeTime = new Date(2000, 1, 1, 20, 0, 0),
			data = {
			id: id,
			name: 'Garage 3k',
			locationID: 1,
			address: '666 Nguyen Hue',
			email: 'asdqlwkjd@3krental.com',
			phone1: '0912312032031',
			star: 3.2,
			isActive: true,
			openTimeMon: openTime,
			closeTimeMon: closeTime,
			openTimeTue: openTime,
			closeTimeTue: closeTime,
			openTimeWed: openTime,
			closeTimeWed: closeTime,
			openTimeThur: openTime,
			closeTimeThur: closeTime,
			openTimeFri: openTime,
			closeTimeFri: closeTime,
			openTimeSat: openTime,
			closeTimeSat: closeTime,
			openTimeSun: openTime,
			closeTimeSun: closeTime
		}

		$(this).find('.modal-content').html(Mustache.render(garageEditorTemplate, data));
	})
});