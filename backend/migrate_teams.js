const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const teamSchema = new mongoose.Schema({ 
            createdBy: mongoose.Schema.Types.ObjectId, 
            members: Array 
        }, { strict: false });
        
        const Team = mongoose.model('Team', teamSchema);
        
        const teams = await Team.find({ createdBy: { $exists: false } });
        console.log(`Found ${teams.length} teams to update.`);
        
        for (let t of teams) {
            const leader = t.members.find(m => m.role === 'Leader');
            if (leader) {
                await Team.updateOne({ _id: t._id }, { createdBy: leader.user });
                console.log(`Updated team ${t._id}`);
            }
        }
        
        console.log('Migration Complete');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

migrate();
