import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<[string, bigint][]>([]);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      const code = await backend.generateQRCode();
      setQrCode(code);
    };

    const fetchLeaderboard = async () => {
      const board = await backend.getLeaderboard();
      setLeaderboard(board);
    };

    fetchQRCode();
    fetchLeaderboard();

    const interval = setInterval(() => {
      fetchQRCode();
      fetchLeaderboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const result = await backend.checkIn();
      if ('ok' in result) {
        setLeaderboard(result.ok);
        alert('Check-in successful!');
      } else {
        alert(`Check-in failed: ${result.err}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
    setLoading(false);
  };

  const handleSetUsername = async () => {
    setLoading(true);
    try {
      const result = await backend.setUsername(username);
      if ('ok' in result) {
        setLeaderboard(result.ok);
        alert('Username set successfully!');
      } else {
        alert(`Failed to set username: ${result.err}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" gutterBottom>Check-In QR Code</Typography>
            {qrCode ? (
              <Typography variant="body1" align="center" sx={{ wordBreak: 'break-all' }}>
                {qrCode}
              </Typography>
            ) : (
              <CircularProgress />
            )}
            <Button variant="contained" color="primary" onClick={handleCheckIn} disabled={loading} sx={{ mt: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Check In'}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Leaderboard</Typography>
            {leaderboard.length > 0 ? (
              leaderboard.map(([name, streak], index) => (
                <Typography key={index} variant="body2">
                  {index + 1}. {name}: {streak.toString()} days
                </Typography>
              ))
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Set Username</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="secondary" onClick={handleSetUsername} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Set Username'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
