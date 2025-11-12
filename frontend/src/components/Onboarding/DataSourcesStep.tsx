import React, { useState } from 'react';
import { useOnboardingState } from '../../hooks/useOnboardingState';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance,
  AccountBalanceWallet,
  CreditCard,
  Receipt,
  CloudUpload,
  CheckCircle,
  Sync,
  Error as ErrorIcon,
} from '@mui/icons-material';

type DataSource = {
  id: string;
  type: 'bank' | 'credit_card' | 'investment' | 'epfo' | 'gst' | 'itr';
  name: string;
  status: 'connected' | 'pending' | 'error' | 'disconnected';
  lastSynced?: string;
  accounts?: Array<{
    id: string;
    name: string;
    balance?: number;
    accountNumber?: string;
  }>;
};

const dataSourceTypes = [
  {
    type: 'bank',
    name: 'Bank Account',
    icon: <AccountBalance fontSize="large" color="primary" />,
    description: 'Connect your savings or current account',
  },
  {
    type: 'credit_card',
    name: 'Credit Card',
    icon: <CreditCard fontSize="large" color="primary" />,
    description: 'Link your credit cards',
  },
  {
    type: 'investment',
    name: 'Investments',
    icon: <AccountBalanceWallet fontSize="large" color="primary" />,
    description: 'Connect mutual funds, stocks, and other investments',
  },
  {
    type: 'epfo',
    name: 'EPFO',
    icon: <Receipt fontSize="large" color="primary" />,
    description: 'Sync your EPF account details',
  },
  {
    type: 'itr',
    name: 'Income Tax',
    icon: <Receipt fontSize="large" color="primary" />,
    description: 'Upload your ITR or connect to Income Tax Portal',
  },
  {
    type: 'gst',
    name: 'GST',
    icon: <Receipt fontSize="large" color="primary" />,
    description: 'Connect your GST account for business finances',
  },
];

export default function DataSourcesStep() {
  const { nextStep, prevStep } = useOnboardingState();
  const [sources, setSources] = useState<DataSource[]>([]);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSource, setCurrentSource] = useState<typeof dataSourceTypes[number] | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    otherDetails: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (source: typeof dataSourceTypes[number]) => {
    setCurrentSource(source);
    
    // For demo purposes, we'll just show the dialog
    // In a real app, this would initiate the OAuth flow or show appropriate form
    if (source.type === 'epfo' || source.type === 'itr' || source.type === 'gst') {
      setOpenDialog(true);
    } else {
      // Simulate API call for bank/investment connections
      setIsLoading(true);
      setConnectingSource(source.type);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add the connected source
        const newSource: DataSource = {
          id: `${source.type}-${Date.now()}`,
          type: source.type as any,
          name: source.name,
          status: 'connected',
          lastSynced: new Date().toISOString(),
          accounts: [
            {
              id: '1',
              name: 'Savings Account',
              balance: 50000,
              accountNumber: 'XXXX-XXXX-7890',
            },
          ],
        };
        
        setSources(prev => [...prev, newSource]);
        toast.success(`${source.name} connected successfully`);
      } catch (error) {
        console.error('Error connecting source:', error);
        toast.error(`Failed to connect ${source.name}`);
      } finally {
        setIsLoading(false);
        setConnectingSource(null);
      }
    }
  };

  const handleDisconnect = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
    toast.success('Account disconnected');
  };

  const handleSubmitCredentials = async () => {
    if (!currentSource) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the connected source
      const newSource: DataSource = {
        id: `${currentSource.type}-${Date.now()}`,
        type: currentSource.type as any,
        name: currentSource.name,
        status: 'connected',
        lastSynced: new Date().toISOString(),
      };
      
      setSources(prev => [...prev, newSource]);
      setOpenDialog(false);
      setCredentials({ username: '', password: '', otherDetails: '' });
      toast.success(`${currentSource.name} connected successfully`);
    } catch (error) {
      console.error('Error connecting source:', error);
      toast.error(`Failed to connect ${currentSource.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSourceStatus = (sourceType: string) => {
    const source = sources.find(s => s.type === sourceType);
    if (!source) return 'disconnected';
    return source.status;
  };

  const isSourceConnected = (sourceType: string) => {
    return sources.some(s => s.type === sourceType && s.status === 'connected');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Connect Your Financial Accounts
      </Typography>
      <Typography color="textSecondary" paragraph>
        Link your accounts to get a complete view of your finances.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        {dataSourceTypes.map((source) => {
          const isConnected = isSourceConnected(source.type);
          const isConnecting = connectingSource === source.type;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={source.type}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  borderColor: isConnected ? 'success.main' : 'divider',
                  borderWidth: isConnected ? 2 : 1,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {isConnected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 10,
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <CheckCircle fontSize="small" />
                    Connected
                  </Box>
                )}
                
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{source.icon}</Box>
                    <Typography variant="h6">{source.name}</Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {source.description}
                  </Typography>
                  
                  {isConnected ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={() => handleDisconnect(source.type)}
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => handleConnect(source)}
                      disabled={isLoading || isConnecting}
                      startIcon={isConnecting ? <CircularProgress size={16} /> : <CloudUpload />}
                    >
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={prevStep}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={nextStep}
          disabled={isLoading || sources.length === 0}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Continue'}
        </Button>
      </Box>

      {/* Credentials Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect {currentSource?.name}</DialogTitle>
        <DialogContent>
          {currentSource?.type === 'epfo' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                To connect your EPF account, please enter your UAN and password.
              </Typography>
              <TextField
                fullWidth
                label="UAN Number"
                margin="normal"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                margin="normal"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
              />
              <Typography variant="caption" color="textSecondary">
                Your credentials are encrypted and securely stored. We do not store your password.
              </Typography>
            </Box>
          )}
          
          {currentSource?.type === 'itr' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Connect to Income Tax Portal or upload your ITR XML file.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                disabled={isLoading}
              >
                <CloudUpload sx={{ mr: 1 }} />
                Upload ITR XML
                <input
                  type="file"
                  hidden
                  accept=".xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload
                      console.log('ITR file selected:', file);
                    }
                  }}
                />
              </Button>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
                OR
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  // Initiate OAuth flow for Income Tax Portal
                  console.log('Initiating OAuth flow for Income Tax Portal');
                }}
                disabled={isLoading}
              >
                Connect to Income Tax Portal
              </Button>
            </Box>
          )}
          
          {currentSource?.type === 'gst' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Connect your GST account by entering your GSTIN and API details.
              </Typography>
              <TextField
                fullWidth
                label="GSTIN"
                margin="normal"
                placeholder="22AAAAA0000A1Z5"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                type="password"
                label="API Key"
                margin="normal"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Client ID"
                margin="normal"
                value={credentials.otherDetails}
                onChange={(e) => setCredentials({ ...credentials, otherDetails: e.target.value })}
                disabled={isLoading}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitCredentials} 
            variant="contained"
            disabled={
              isLoading || 
              !credentials.username || 
              !credentials.password ||
              (currentSource?.type === 'gst' && !credentials.otherDetails)
            }
          >
            {isLoading ? <CircularProgress size={24} /> : 'Connect'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
