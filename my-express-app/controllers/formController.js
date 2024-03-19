const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.serveForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
};

exports.handleSubmit = async (req, res) => {
    const { letter, email, quantity, unit } = req.body;
    
    try {
        const timeToSend = calculateFutureTime(quantity, unit);
        
        const { data, error } = await supabase
            .from('emails')
            .insert([
                { letter: letter, email: email, time_to_send: timeToSend }
            ]);
        
        if (error) {
            console.error('Error inserting into Supabase', error);
            return res.status(500).send('Error saving data');
        }
        
        console.log('Data inserted:', data);
        res.send('Data saved successfully!');
    } catch (error) {
        console.error('Error calculating future time', error);
        res.status(400).send(error.message);
    }
};


function calculateFutureTime(quantity, unit) {
    let timeToAdd; // Time to add in seconds
    
    switch(unit) {
        case 'minute':
            timeToAdd = quantity * 60; 
            break;
        case 'hour':
            timeToAdd = quantity * 3600; 
            break;
        case 'day':
            timeToAdd = quantity * 86400; 
            break;
        case 'week':
            timeToAdd = quantity * 604800; 
            break;
        case 'year':
            timeToAdd = quantity * 31536000; 
            break;
        default:
            throw new Error('Invalid time unit');
    }
    
    const currentTime = Math.floor(Date.now() / 1000); 
    return currentTime + timeToAdd; // Future time as Unix timestamp
}