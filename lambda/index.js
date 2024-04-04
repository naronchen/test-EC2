require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// AWS SES part
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const ses = new AWS.SES();

exports.handler = async (event) => {
    const currentTime = Math.floor(Date.now() / 1000);
    let { data, error } = await supabase
        .from('emails')
        .select('letter, email')
        .lte('time_to_send', currentTime);
    if (error) {
        console.error('Error fetching data:', error);
        return { statusCode: 500, body: 'Failed to fetch data' };
    }

    // process and send email
    for (const row of data) {
        const {email, letter} = row;
        const params = {
            Source: 'naron.chen1@gmail.com',
            Destination: {
                ToAddresses: [email]
            },
            Message:{
                Subject:{
                    Data: 'Time-Capsule Email', // @TODO: should allow user to set subject
                },
                Body:{
                    Text:{
                        Data: letter
                    }
                }
            }
        }
        try {
            await ses.sendEmail(params).promise();
            console.log(`Email sent to ${email}`);

            // delete the email from the database
            const {data, error} = await supabase
                .from('emails')
                .delete()
                .match({email, letter});
            if (error) {
                console.error(`Error deleting email to ${email}:`, error);
            }
            
        } catch (sendError) {
            console.error(`Error sending email to ${email}:`, sendError);
        }
    }


    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

// For testing locally
// (async () => {
//     const response = await exports.handler();
//     console.log(response.body);
// })();
