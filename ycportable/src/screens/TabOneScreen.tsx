import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootTabScreenProps } from '../../types';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [state, setState] = useState<any[]>([])

  useEffect(() => {
    fetch(
      "https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns",
      {headers: new Headers({
        // TODO: populate from auth state (currently requires a manual enter)
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1rUkRNVFk0UTBZd1FqSTROa1F3T1RrMFJUTkNORU5FTnpRMk1EY3hOVEl5UVRORlJFUXpNZyJ9.eyJodHRwczovL2F1dGgueWllbGRpZnkuY29tL3VzZXJEYXRhIjp7ImVtYWlsIjoicm9yeS5tYWNhdWxleUB5aWVsZGlmeS5jb20iLCJyb2xlcyI6WyJBZG1pblVzZXIiXX0sImlzcyI6Imh0dHBzOi8veWllbGRpZnktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MjAzZDE1MzRiNDVmMTAwNjgxNTk5YzQiLCJhdWQiOlsieWNwIiwiaHR0cHM6Ly95aWVsZGlmeS1kZXYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1Mjc5NTEwNiwiZXhwIjoxNjUyNzk2OTA2LCJhenAiOiJ4REZ1WklNM1FGRHEzOUNPcm82RndpMlBIQzVhejRkciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.hbfuLeZ5D_qnZuf6ycgO9hHP_n3Lu6glzc9dJ1FyGokgYZj6vIKEwH_-NOCWNidrFPEiY9Tco8SetS1At3AaUiQSD_wlNpPeaJAYgXWr9nD5xKHLdQheqTa2JWUvs-DwK8tVfKs70x-4UauT-i_Bv0-O65dTlbYIbboaoApyMsk3FR5GiJDsBQM9nih05uBBM12NnFoEBZnykgHD8FuoM7kl2lrqLVTk0TfO1WyWaX1W9PFEkD3lZMSpAhUoNkQoye6yRtqIf44Al771fJ_fJ21i3FmoDSSTFdnrU6_zr65DKJKAd_57-Yl1SNJpPp3ECCqD-v898N5QBrK_FNh0xA',
        'Content-Type': 'application/json'
    }), }
    )
    .then(response => response.json())
    .then(json => {
      setState(json); // access json.body here
    }).catch((err) =>{
      alert(err);
    })
  }, []);

  return (
    <View style={styles.container}>
      {state.map((campaign) => {
        return (
        <View>
          <Text>{`name: ${campaign.name}`}</Text>
        </View>);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
