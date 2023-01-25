if(document.querySelector('meta[name="description"]')){
    if(document.URL.includes('https://draft.reserve.org/') || document.URL.includes('http://127.0.0.1:8000/')){
        if(document.querySelector('meta[name="description"]').content == '' || document.title == ''){
            //$('#main-content').html('No <b>title</b> or <b>page_description</b> found for the current page, please fill all the required fields.');
        }
    }

    if(document.URL.includes('https://reserve.org/')){

    }
}

