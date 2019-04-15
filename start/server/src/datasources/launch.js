// Step 8 Connect a Rest API
// source is a class that encapsulates all of the data fetching logic, 
// as well as Caching and Deduplication, for a particular service.
// npm install apollo-datasource-rest --save

const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    // Step 9 add an API to match type Query in Step 3 "launches"
    async getAllLaunches() {
        const response = await this.get('launches');

        // transform the raw launches to a more friendly
        return Array.isArray(response) ?
            response.map(launch => this.launchReducer(launch)) : [];
    }

    //Step 10 create a method to Shape our Data coming in from API
    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }
    // Step 11 Add API's to get launch or launches
    async getLaunchById({
        launchId
    }) {
        const response = await this.get('launches', {
            flight_number: launchId
        });
        return this.launchReducer(response[0]);
    }

    getLaunchesByIds({
        launchIds
    }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({
                launchId
            })),
        );
    }
}





module.exports = LaunchAPI;