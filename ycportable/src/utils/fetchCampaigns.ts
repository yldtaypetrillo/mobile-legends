interface CampaignsSearchProps {
  token: string;
  pageNumber?: number;
  searchTerm?: string;
  campaignState?: string;
}

// TODO: remove mocked fetchCampaigns
const delay = (time: number) => new Promise((res) => setTimeout(res, time));
export async function fetchCampaigns({
  token,
  pageNumber,
  searchTerm,
  campaignState,
}: CampaignsSearchProps) {
  await delay(2000);

  const data = require('../config/mocked-campaigns.json');

  console.log(data);

  return data;
}

// export async function fetchCampaigns({
//   token,
//   pageNumber,
//   searchTerm,
//   campaignState,
// }: CampaignsSearchProps) {
//   let url = `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns?page=${pageNumber}&per_page=15&order[name]=asc`;

//   if (searchTerm) {
//     url += `&search[filter]=${searchTerm}`;
//   }

//   if (campaignState) {
//     if (campaignState === 'preview') {
//       url += '&search[testing_mode]=true';
//     } else {
//       url += `&[state]=${campaignState}`;
//     }
//   }

//   const response = await fetch(url, {
//     headers: new Headers({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     }),
//   });

//   const data = await response.json();

//   return data;
// }
