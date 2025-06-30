function formatTimeAgo(isoDate: string): string {
    const now = new Date();
    const then = new Date(isoDate);
    const diff = (now.getTime() - then.getTime()) / 1000;
  
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} weeks ago`;
  }

export {
    formatTimeAgo
};