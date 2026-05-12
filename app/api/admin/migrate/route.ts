import { connectToDB } from "@/utils/database";
import CirculationTemplate from "@/models/CirculationTemplate";
import { findGidForStop } from "@/lib/vasttrafik";

async function migrate() {

 await connectToDB();

 const templates = await CirculationTemplate.find({});

 for (const template of templates){

   let changed = false;

   for (const trip of template.trips){

     if(!trip.destinationGid){

       trip.destinationGid =
         await findGidForStop(trip.destinationName);

       changed = true;

       console.log(
        `Updated ${trip.destinationName} -> ${trip.destinationGid}`
       );
     }
   }

   if(changed){
     await template.save();
   }
 }

 console.log("Migration complete");
}

migrate();