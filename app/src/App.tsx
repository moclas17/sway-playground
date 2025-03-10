import React, { useCallback, useState } from 'react';
import Editor from './features/editor/components/Editor';
import ActionToolbar from './features/toolbar/components/ActionToolbar';
import LogView from './features/editor/components/LogView';
import { useCompile } from './features/editor/hooks/useCompile';
import { DeployState } from './utils/types';
import { loadCode, saveCode } from './utils/localStorage';
import InteractionDrawer from './features/interact/components/InteractionDrawer';
import { useLog } from './features/editor/hooks/useLog';
import { Toolchain } from './features/editor/components/ToolchainDropdown';

const DRAWER_WIDTH = '40vw';

function App() {
  // The current code in the editor.
  const [code, setCode] = useState(loadCode());

  // The most recent code that the user has requested to compile.
  const [codeToCompile, setCodeToCompile] = useState<string | undefined>(
    undefined
  );

  // Whether or not the current code in the editor has been compiled.
  const [isCompiled, setIsCompiled] = useState(false);

  // The toolchain to use for compilation.
  const [toolchain, setToolchain] = useState<Toolchain>('beta-3');

  // The deployment state
  const [deployState, setDeployState] = useState(DeployState.NOT_DEPLOYED);

  // Functions for reading and writing to the log output.
  const [log, updateLog] = useLog();

  // The contract ID of the deployed contract.
  const [contractId, setContractId] = useState('');

  // An error message to display to the user.
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCodeChange = useCallback(
    (code: string) => {
      saveCode(code);
      setCode(code);
      setIsCompiled(false);
    },
    [setCode]
  );

  const setError = useCallback(
    (error: string | undefined) => {
      updateLog(error);
    },
    [updateLog]
  );

  useCompile(codeToCompile, setError, setIsCompiled, updateLog, toolchain);

  return (
    <div
      style={{
        height: 'calc(100vh - 30px)',
        padding: '15px',
        margin: '0px',
        background: '#F1F1F1',
      }}>
      <div
        style={{
          marginRight: drawerOpen ? DRAWER_WIDTH : 0,
          transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        }}>
        <ActionToolbar
          deployState={deployState}
          setContractId={setContractId}
          onCompile={() => setCodeToCompile(code)}
          isCompiled={isCompiled}
          setDeployState={setDeployState}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          updateLog={updateLog}
        />
        <Editor
          code={code}
          onChange={onCodeChange}
          toolchain={toolchain}
          setToolchain={setToolchain}
        />
        <LogView results={log} />
      </div>
      <InteractionDrawer
        isOpen={drawerOpen}
        width={DRAWER_WIDTH}
        contractId={contractId}
        updateLog={updateLog}
      />
    </div>
  );
}

export default App;
