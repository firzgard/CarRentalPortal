// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';
		
function renderStarRating(starRating, color, hasBadge = true, renderEmptyStar = true){
	let html = ''
	if(renderEmptyStar){
		for(star = starRating, i = 0; i < 5; i++) {
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
	} else {
		for(i = 0; i < starRating; i++) {
			html += fullStar;
		}
	}
	if (color) html = `<span style="color:${color};">${html}</span>`
	if (hasBadge) html += `&nbsp;<span class="badge">${starRating}</span>`;
	return html
}