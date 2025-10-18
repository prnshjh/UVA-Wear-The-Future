import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

type Transaction = {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string | null;
  created_at: string;
  order_id: string | null;
};

type WalletData = {
  balance: number;
  id: string;
};

const Wallet = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Login required',
        description: 'Please login to view your wallet',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    if (user) {
      loadWalletData();
    }
  }, [user, authLoading, navigate]);

  const loadWalletData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;
      setWallet(walletData);

      // Load transactions
      const { data: txData, error: txError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletData.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (txError) throw txError;
      setTransactions((txData || []) as Transaction[]);
    } catch (error) {
      console.error('Error loading wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 px-4">
          <div className="max-w-4xl mx-auto py-12">
            <Skeleton className="h-48 w-full mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto py-12">
          <div className="flex items-center mb-8">
            <WalletIcon className="h-8 w-8 mr-3" />
            <h1 className="text-3xl font-bold">My Wallet</h1>
          </div>

          {/* Wallet Balance Card */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold mb-4">
                {wallet?.balance.toLocaleString()} <span className="text-2xl text-muted-foreground">coins</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                1 coin = ₹1 | Redeemable during month-end sale
              </p>
            </div>
          </Card>

          {/* Info Banner */}
          <div className="mb-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h3 className="font-semibold mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              How it works
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Earn 1 coin for every ₹1 spent on orders</li>
              <li>• Redeem coins during our exclusive month-end sales</li>
              <li>• Check back regularly for redemption opportunities</li>
            </ul>
          </div>

          {/* Transaction History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm mt-2">Start shopping to earn coins!</p>
                <Button className="mt-4" onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {tx.type === 'credit' ? (
                        <div className="p-2 rounded-full bg-green-500/10">
                          <ArrowUpCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-red-500/10">
                          <ArrowDownCircle className="h-5 w-5 text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {tx.description || (tx.type === 'credit' ? 'Coins Earned' : 'Coins Redeemed')}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} coins
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wallet;
