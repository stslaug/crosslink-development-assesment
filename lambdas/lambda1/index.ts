/* 
  https://currentsapi.services/en/docs/ 
	
  API Key must be added to lambda settings to work! (Should be prompted in cloudformation stack setup)
	
  This code is included as an inline definition in cloudformation/main.yml. No need to import code manually
  I had to do inline, as alternative I saw was host on s3 bucket. Didn't want to risk going above free tier
*/


exports.handler = async (event) => {
  /*
   Header and Required Information Checking
  */
  /* API Key Check */
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'API Key Missing. Ask service administrator for help!' })
    };
  }

  /* Page Size */
  let pageSizeHeader = event.headers["pageSize"] || event.headers["pagesize"];
  let pageSize = parseInt(pageSizeHeader, 10);
  if (pageSizeHeader && isNaN(pageSize)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error pageSize is not a number! Correct Fields and try again' })
    }
  } else if (pageSize > 50 || pageSize < 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error! pageSize improper value. Please set pageSize to 0 < x < 50' })
    }
  }



  /* Page Number */
  const pageNumberHeader = event.headers["page"] || event.headers["Page"];
  let pageNumber = parseInt(pageNumberHeader, 10);
  if (pageNumberHeader && isNaN(pageNumber)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error page is not a number! Correct Fields and try again' })
    }
  } 
  if(pageNumber && (pageNumber > 180 || pageNumber < 0)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error! page improper value. Please set page to 0 < x < 180' })
    }
  }

  if(pageSize && pageNumber && (((pageNumber - 1) * pageSize) > 5000)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error! page * pageSize value too large. Max value total value is 5000 (CurrentsAPI Hard Limit)' })
  }
}

/* Keywords validation */
  const keywords = event.headers["keywords"] || event.headers["Keywords"];
  if(keywords && keywords.length > 100) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error keywords exceed 100 character limit' })
    }
  } 
  if(keywords && (keywords.includes("?") || keywords.includes("&"))) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error keywords includes invalid character "?" or "&"' })
    }
  }

  /* Domain Validation */
  const domain = event.headers["domain"] || event.headers["Domain"];
  if(domain && domain.length > 100) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error domain exceed 100 character limit' })
    }
  }
  if(domain && (domain.includes("?") || domain.includes("&")))
  {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Error domain includes invalid character "?" or "&"' })
    }
  }



  try {
    /*Dynamically Create the API Request link based on potentially added headers. 
    Omit if not there 
    I would typically not mix api endpoints like this (switching between search and latest-news)
    Just trying to utilize as much of this API as possible within this 1 lambda
    */
    let apiRequestLink = ("https://api.currentsapi.services/v1/" + (keywords ? "search" : "latest-news") + "?language=en" + (keywords ? ("&keywords="+keywords) : "") + (pageSize ? ("&page_size=" + pageSize) : "&page_size=5") + (pageNumber ? ("&page_number=" + pageNumber) : "&page_number=1") + (domain ? ("&domain="+domain) : ""));

    const response = await fetch(apiRequestLink, {
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) { /*Terminate if a valid response wasn't returned*/
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Error! reqLink: ${apiRequestLink} headers: pageSize: ${pageSize} page: ${pageNumber} status: ${response.status}` })
      };
    }
    const data = await response.json();
    return { /* Successful Response */
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { /* General Response */
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};