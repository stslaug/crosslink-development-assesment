/* 
	https://currentsapi.services/en/docs/ 
	
	API Key must be added to lambda settings to work!
	
	This code is included as an inline definition in cloudformation/main.yml. No need to import code manually
	
	I had to do inline, as alternative I saw was host on s3 bucket. Didn't want to risk going above free tier


*/

export const handler = async (event) => {
          const apiKey = process.env.API_KEY;
          
          if (!apiKey) {
            return {
              statusCode: 500,
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({ error: "API Key Missing" })
            };
          }

          try {
            const response = await fetch('https://api.currentsapi.services/v1/latest-news', {
              headers: {
                'Authorization': apiKey
              }
            });

            if (!response.ok) {
              return {
                statusCode: response.status,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ error: `Error! Check API key or API Status!  status: ${response.status}` })
              };
            }

            const data = await response.json();
          
            return {
              statusCode: 200,
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(data)
            };

          } catch (error) {
            return {
              statusCode: 500,
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({ error: error.message })
            };
          }
        };