// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';
		
function renderStarRating(starRating, color = '#4CAF50', hasBadge = true, renderEmptyStar = true){
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
	if (color) html = `<span style="color:${color};white-space: nowrap;">${html}</span>`
	if (hasBadge) html += `&nbsp;<span class="badge">${starRating}</span>`;
	return html
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePhone(num) {
    if(num.length < 10 || num.length > 20) {
        return false;
    }
    var regex = /^[0-9-+]+$/;
    return regex.test(num);
}

function renderComma(str) {
    if (str.length < 4) {
        return str;
    }
    return str.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}