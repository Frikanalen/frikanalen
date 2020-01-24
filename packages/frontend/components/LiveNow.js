const LiveNow = () => (
  <div id="live">
    <h1>Frikanalen broadcast</h1>
    <video width="1024" height="576" controls src="http://icecast.frikanalen.no/frikanalen.webm"></video>
  </div>
)

const ScheduleInfo = () => (
        <div id="next" className="ontv">
            <div className="ontv-head">
                Next video on TV

            </div>
            <div className="ontv-video">
                <strong>15:28</strong>
                &ndash;
                <a href="/video/624330/">Empo tv - del 37</a>
            </div>

            <div className="ontv-org">
                Organization:
                <a href="/organization/66/">
                    Empo AS
                </a>
                (961686601,
                https://www.empo.no/)
            </div>

            <div className="ontv-editor">
                Editor:
                Gro Tronvold
                (prosjektmedarbeidere@empo.no)
            </div>
        </div>
        )
        

export default LiveNow;
