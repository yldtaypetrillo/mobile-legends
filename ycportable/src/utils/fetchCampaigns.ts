interface CampaignsSearchProps {
    token:string;
    pageNumber?: number;
    searchTerm?:string;
    campaignState?: string;
}

export async function fetchCampaigns({token,pageNumber,searchTerm,campaignState}:CampaignsSearchProps) {
    let url = `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns?page=${pageNumber}&per_page=15&order[name]=asc`;    

    if (searchTerm) {
        url += `&search[filter]=${searchTerm}`
    }

    if (campaignState) {
        if(campaignState === 'preview') {
          url += '&search[testing_mode]=true'
        } else {
          url += `&[state]=${campaignState}`
        }
    }

    const response = await fetch(url,
        {
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        }
      );

    const data = await response.json();

    return data;
}