import React from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, Grid, Divider,
} from '@mui/material';

const TEAM = [
  {
    name: 'Cambden Hadley',
    role: 'PM & Frontend Developer',
    bio: 'Placeholder bio',
    image: '/images/IMG_8088.jpeg',
  },
  {
    name: 'Jeffery Cheeseman',
    role: 'Sound Maker',
    bio: 'Placeholder bio',
    image: '/images/IMG_9591.jpeg',
  },
  {
    name: 'James Jeffers',
    role: 'Backend Developer',
    bio: 'Placeholder bio',
    image: '/images/IMG_9592.jpeg',
  },
];

export default function About() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 2 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          component="img"
          src="/images/NewRampageLogo.png"
          alt="HabitX Logo"
          sx={{ height: 80, mb: 2, objectFit: 'contain' }}
        />
        <Typography variant="h4" fontWeight={800} gutterBottom>
          About HabitX
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Here at Routine Rampage, we are focused on helping users track,
            manage, and improve both their good and bad habits in a way that is
            simple, and motivating.
        </Typography>
      </Box>

      <Divider sx={{ mb: 5 }} />

      {/* Team */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        The Team
      </Typography>
      <Grid container spacing={3}>
        {TEAM.map((member) => (
          <Grid item xs={12} sm={4} key={member.name}>
            <Card
              elevation={2}
              sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                image={member.image}
                alt={member.name}
                sx={{ height: 260, objectFit: 'cover', objectPosition: 'top' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={600} gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
