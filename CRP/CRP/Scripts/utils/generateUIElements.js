// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';
		
function renderStarRating(starRating){
	for(var html = '', star = starRating, i = 0; i < 5; i++) {
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
	return html += `&nbsp;<span class="badge">${starRating}</span>`
}