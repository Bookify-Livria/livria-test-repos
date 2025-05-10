import axios from 'axios';
import { CommunityAssembler } from './community.assembler.js';

export class CommunityApiService {
    getCommunities() {
        return axios.get('http://localhost:3000/communities')
            .then(response => CommunityAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching books:', error);
                throw error;
            });
    }
    createCommunity(community) {
        return fetch('http://localhost:3000/communities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(community)
        }).then(res => res.json())
    }
}