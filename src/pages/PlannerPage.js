import React, { useEffect, useState } from 'react';
import { fetchPlannerPlansForUser, fetchPlanTasks, createPlannerTask } from '../services/graph';
import { login } from '../services/auth';
import Button from '../components/common/Button';

export default function PlannerPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await fetchPlannerPlansForUser();
        if (!mounted) return;
        setPlans(p || []);
        if ((p || []).length > 0) setSelectedPlan(p[0]);
      } catch (e) {
        const msg = (e && e.message) ? e.message : String(e);
        if (msg.toLowerCase().includes('authentication') || msg.includes('401')) {
          setError('Authentication required — please sign in');
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedPlan) return;
    let mounted = true;
    async function loadTasks() {
      try {
        const t = await fetchPlanTasks(selectedPlan.id);
        if (!mounted) return;
        setTasks(t || []);
      } catch (e) {
        setError(e.message || String(e));
      }
    }
    loadTasks();
    return () => { mounted = false; };
  }, [selectedPlan]);

  async function handleCreateQuickTask() {
    if (!selectedPlan) return;
    try {
      // ensure signed in
      await login();
      const bucketsRes = await fetch(`/planner/plans/${selectedPlan.id}/buckets`);
      const bucketsJson = await bucketsRes.json();
      const firstBucket = (bucketsJson && bucketsJson.value && bucketsJson.value[0]) || null;
      if (!firstBucket) throw new Error('No buckets available on this plan');
      await createPlannerTask({ title: `Quick task ${Date.now()}`, planId: selectedPlan.id, bucketId: firstBucket.id });
      // refresh tasks
      const refreshed = await fetchPlanTasks(selectedPlan.id);
      setTasks(refreshed || []);
    } catch (e) {
      setError(e.message || String(e));
    }
  }

  if (loading) return <div>Loading Planner...</div>;
  if (error) return (
    <div style={{ color: 'red' }}>
      <div>{error}</div>
      <div style={{ marginTop: 8 }}><Button onClick={() => login()}>Sign in</Button></div>
    </div>
  );

  return (
    <div className="page planner-page">
      <header>
        <h1>Planner</h1>
      </header>
      <section style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 280 }}>
          <h3>Plans</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {plans.map(p => (
              <li key={p.id} style={{ padding: 8, cursor: 'pointer', background: selectedPlan && selectedPlan.id === p.id ? '#f3f6fb' : 'transparent' }} onClick={() => setSelectedPlan(p)}>
                {p.title}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Tasks</h3>
            <div><Button onClick={handleCreateQuickTask}>Quick Add</Button></div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(t => (
              <li key={t.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{t.percentComplete}%</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
