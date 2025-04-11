

const AnalyticsPanel = () => {
  return (
    <div className="analytics-panel">
      <h2>Yöneticiler İçin Analytics</h2>
      <div className="analytics-boxes">
        <div className="analytics-box">
          <h3>Toplam Kullanıcı</h3>
          <p>42</p>
        </div>
        <div className="analytics-box">
          <h3>Admin Sayısı</h3>
          <p>5</p>
        </div>
        <div className="analytics-box">
          <h3>Bugüne Kadar Eklenen Objeler</h3>
          <p>150</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;